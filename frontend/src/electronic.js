import React, {useState,useEffect}from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button,Container,Row,Col,Navbar, Nav,NavDropdown} from 'react-bootstrap';
// import Chart from 'react-google-charts'
import Chart from 'react-apexcharts'

let warning = true
// const res = {
//     "data": [
//         {
//             "區": "北",
//             "時間": [
//             "2023-04-03 00:00:00"
//             ],
//             "供電(萬瓩)": [
//             1043.8199999999999
//             ],
//             "負載(萬瓩)": [
//             919.881
//             ]
//         }
//     ]
// }
// let Data = res['data']
// let raw_data = []
// let tmp_data = {}
// tmp_data["name"] = "供電"
// tmp_data["data"] = Data[0]["供電(萬瓩)"]
// raw_data.push(tmp_data)
// tmp_data = {}
// tmp_data["name"] = "負載"
// tmp_data["data"] = Data[0]["負載(萬瓩)"]
// raw_data.push(tmp_data)

// if(raw_data[0]["data"][0] <= raw_data[1]["data"][0]){
//     warning = true
// }  
// else {
//     warning = false
// }
    
// console.log("raw_data",warning)

const options = {
chart: {
    id: "bar",
    height: 350
},

xaxis: {
    categories: [''] //will be displayed on the x-asis
},
stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
},
plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '80%',
      endingShape: 'rounded'
    },
},
};



const ElectronicPage=()=>{

    let Page = "Electronic"
    // const [electricity, setElectricity] = useState({
    //     year_to: 2022,
    //     month_to: 6,
    //     day_to: 6,
    //     hour_to: 12,
    //     past_days: 1,
    //     power_plant_regions: ['北']
    // })
    const [area, setArea] = useState("竹科");
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
        let power_plant_regions = []
        if(area==="north"){
            power_plant_regions = ["北"]
        }
        else if(area ==="center"){
            power_plant_regions = ["中"]
        }
        else{
            power_plant_regions = ["南"]
        }
        let body = {
            year_to: 2023,
            month_to: 4,
            day_to: 30,
            hour_to: 12,
            past_days: 1,
            power_plant_regions: power_plant_regions
        }
        
        fetch("http://127.0.0.1:8551/electricity_fetch/", {
            method: 'POST',
            body: JSON.stringify(body),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
        .then(res => {
            console.log("res",res)         
            let Data = res['data']
            let raw_data = []
            let tmp_data = {}
            tmp_data["name"] = "供電"
            tmp_data["data"] = Data[0]["供電(萬瓩)"]
            raw_data.push(tmp_data)
            tmp_data = {}
            tmp_data["name"] = "負載"
            tmp_data["data"] = Data[0]["負載(萬瓩)"]
            raw_data.push(tmp_data)
            if(raw_data[0]["data"][0] <= raw_data[1]["data"][0])
                warning = true
            else 
                warning = false
            setrawdata(raw_data)
        })

    }


    useEffect(() => {
        handleAPI("north");
      }, []);
    return (
        <>
            <header>
            <Navbar bg="dark" variant='dark' expand="lg" style={{ height: '150px'}}>
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
                            water
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
                    <h2 style={{ display: 'flex', alignItems: 'center' }}>
                        電力供需狀況(單位: 萬瓩)
                        {warning===true ? (
                            <div style={{ color: 'red'}}>(warning!!!)</div>
                        ) : null}
                    </h2>
                </Row>
                <Row >
                    <div className="container mt-5">                   
                        <Chart options={options} type="bar" series={rawdata} width="85%" />
                    </div>

                </Row>
            </Container>
                  
            </main>
        </>
      );
}

export default ElectronicPage;