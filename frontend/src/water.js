import React, {useState,useEffect}from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button,Container,Row,Col,Navbar, Nav,NavDropdown} from 'react-bootstrap';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WaterPage=()=>{

    let Page = "Reservoir"
    
    const yellow = 30
    const red = 10

    const [area, setArea] = useState("竹科");
    const [data, setWaterinfo] = useState([]);
    const [rawdata, setrawdata] = useState([]);

    const handleDropdownSelect = (item) => {
        if(item==="north"){
            setArea("竹科");
        }
        else if(item==="center"){
            setArea("中科");
        }
        else{
            setArea("南科");
        }

        handleAPI(item)
    }

    const handleAPI = (area) => {

        const date = new Date();

        let reservoir_name=[]
        if(area==="north"){
            reservoir_name = ["石門水庫","寶山第二水庫","永和山水庫"]
        }
        else if(area ==="center"){
            reservoir_name = ["鯉魚潭水庫","德基水庫"]
        }
        else{
            reservoir_name = ["南化水庫","曾文水庫","烏山頭水庫"]
        }
        
        let PH = 7;
        
        let body = {
            year_to: 2023,
            month_to: 6,
            day_to: 6,
            hour_to: 12,
            past_hours: PH,
            reservoir_names: reservoir_name
        }

        fetch("http://127.0.0.1:7500/reservoir_fetch/", {
            method: 'POST',
            body: JSON.stringify(body),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
        .then(res => {
            let Data = res['data']

            console.log("Data",Data)

            let raw_data = []
            for(let i=0;i<Data.length;i++){ // 幾個水庫資料
                let tmp_data = {}
                tmp_data['name'] = Data[i]["水庫名稱"]
                tmp_data['endtime'] = date.getHours()
                let tmp_data_list = []
                for(let j=0;j<PH;j++){
                    if(j>=Data[i]["有效蓄水量(萬立方公尺)"].length){
                        tmp_data_list.push(Data[i]["有效蓄水量(萬立方公尺)"][Data[i]["有效蓄水量(萬立方公尺)"].length-1])
                    }
                    else{
                        tmp_data_list.push(Data[i]["有效蓄水量(萬立方公尺)"][j])
                    }
                }
                tmp_data['time'] = tmp_data_list
                tmp_data['color'] = ""
                tmp_data_list = []
                for(let j=0;j<PH;j++){
                    if(j>=Data[i]["蓄水百分比(%)"].length){
                        tmp_data_list.push(Data[i]["蓄水百分比(%)"][Data[i]["有效蓄水量(萬立方公尺)"].length-1])
                    }
                    else{
                        tmp_data_list.push(Data[i]["蓄水百分比(%)"][j])
                    }
                }
                tmp_data['pencentage'] = tmp_data_list
                raw_data.push(tmp_data)
            }
            console.log("raw_data",raw_data)

            let waterinfo = [];
            for(let i=0;i<raw_data[0].time.length;i++){ // 過去7小時
                let tmp={};
                let t = raw_data[0].endtime-raw_data[0].time.length+i+1;
                if(t<=0){
                    t = t+24;
                }
                tmp["time"]=t.toString()+":00";
                for(let j=0;j<raw_data.length;j++){ // 所有水庫
                    tmp[raw_data[j].name]=raw_data[j].time[i];
                    tmp[raw_data[j].name+"P"]=raw_data[j].pencentage[i] // 蓄水比例

                    if(i===raw_data[0].time.length-1){ // 水庫當前水量
                        if(raw_data[j].pencentage[i]>yellow){
                            raw_data[j]["color"] = "#0EC23F"; // 綠色 健康水位
                        }
                        if(raw_data[j].pencentage[i]<=yellow){
                            raw_data[j]["color"]  = "#E4CC08"; // 黃色
                        }
                        if(raw_data[j].pencentage[i]<=red){
                            raw_data[j]["color"]  = "#EA1B0C"; // 紅色 危險水位
                        }
                    }
                }
                
                waterinfo.push(tmp);
                console.log({tmp});
            }
            
            console.log("waterinfo",waterinfo)
            setrawdata(raw_data)
            setWaterinfo(waterinfo)
        })

    }

    useEffect(() => {
        handleAPI("north");
      }, []);

    return (
        <>
            <header>
            <Navbar bg="dark" variant='dark' expand="lg" style={{ height: '15vh'}}>
                <Container sm={4} >
                    <Navbar.Brand  href="/">Meteorological center</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="area" id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={ () =>handleDropdownSelect('north')}>
                            竹科
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleDropdownSelect('center')}>
                            中科
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleDropdownSelect('south')}>
                            南科
                        </NavDropdown.Item>
                        </NavDropdown>
                        
                        <NavDropdown title="Information" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/earthquake">
                            earthquake
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/electronic">
                            electronic
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/water">
                            reservoir
                        </NavDropdown.Item>
                        </NavDropdown>
                        
                    </Nav>
                    </Navbar.Collapse>
                </Container>

                <Container sm={4} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Navbar.Brand style={{ fontSize: '40px' }}>
                        {Page}({area})
                    </Navbar.Brand>
                </Container>

                <Container sm={4} >

                </Container>
            </Navbar>
            </header>
            <main>
                <Container fluid style={{ backgroundColor: 'azure', height: '85vh'}}>
                    <Row >
                        <Col sm={6} style={{ backgroundColor: 'azure'}}>
                        <div style={{ width: '100%' }}>
                            {rawdata.map((item) => (
                                <div>
                                    <div style={{height:"15px"} }></div>
                                    <h4 style={{ display: 'flex', alignItems: 'center' }}>
                                        {item.name}
                                        {item.color==="#EA1B0C" ? (
                                            <div style={{ color: 'red'}}>(warning!!!)</div>
                                        ) : null}
                                    </h4>

                                    <div style={{fontSize:15,fontFamily:"Microsoft JhengHei",height:"15px"} }> 蓄水量(萬立方公尺) </div>
                                    <div style={{height:"15px"} }></div>
                                    
                                    <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart
                                        width={500}
                                        height={200}
                                        data={data}
                                        syncId="anyId"
                                        margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey={item["name"]} stroke="#73DEF3" fill="#73DEF3" />
                                    </AreaChart>
                                    </ResponsiveContainer>

                                    <div style={{height:"15px",width: '100%',display: 'flex', alignItems: 'center'} }> 
                                        <div style={{fontSize: 20,fontFamily:"Microsoft JhengHei",width: '100%',display: 'flex', alignItems: 'center',justifyContent:"center"}}>
                                            水情時間
                                        </div>
                                    </div>
                                </div>
                                
                            ))}
                            
                            

                        </div>
                        </Col>
                        
                        <Col sm={6} style={{ backgroundColor: 'azure'}}>
                        <div style={{ width: '100%' }}>
                            {rawdata.map((item) => (
                                <div>
                                    <div style={{height:"15px"} }></div>
                                    <h4 style={{ display: 'flex', alignItems: 'center',color: 'transparent' }}>
                                        {item.name}
                                        {item.color==="#EA1B0C" ? (
                                            <div style={{ color: 'red'}}></div>
                                        ) : null}
                                    </h4>

                                    <div style={{fontSize:15,fontFamily:"Microsoft JhengHei",height:"15px"} }> 蓄水百分比(%)</div>
                                    <div style={{height:"15px"} }></div>
                                    
                                    <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart
                                        width={500}
                                        height={200}
                                        data={data}
                                        syncId="anyId"
                                        margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" />
                                        <YAxis domain={[0, 100]}/>
                                        <Tooltip />
                                        <Area type="monotone" dataKey={item["name"]+"P"} stroke={item["color"]} fill={item["color"]} />
                                    </AreaChart>
                                    </ResponsiveContainer>

                                    <div style={{height:"15px",width: '100%',display: 'flex', alignItems: 'center'} }> 
                                        <div style={{fontSize: 20,fontFamily:"Microsoft JhengHei",width: '100%',display: 'flex', alignItems: 'center',justifyContent:"center"}}>
                                            水情時間
                                        </div>
                                    </div>
                                </div>
                                
                            ))}
                            
                            

                        </div>

                        </Col>
                    </Row>
                    
                </Container>
            </main>
        </>
      );
}

export default WaterPage;