
import 'bootstrap/dist/css/bootstrap.css';
import { Button,Container,Row,Col,Navbar, Nav,NavDropdown} from 'react-bootstrap';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import React, {useState,useEffect}from 'react';
const center = [23.80273601673441, 120.97529630945223]


// data範例格式
// const res = {
//     "data": [
//         {
//             "區": "北",
//             "時間": [
//                 "2021-03-30 06:06:55",
//                 "2021-03-30 22:16:42",
//                 "2021-03-31 03:07:20",
//                 "2021-04-02 13:50:56",
//                 "2021-04-03 15:31:18"
//             ],
//             "震度階級": [
//                 0,
//                 0,
//                 0,
//                 0,
//                 0
//             ],
//             "震央經度": [
//                 122.02,
//                 121.15,
//                 121.81,
//                 121.07,
//                 120.14
//             ],
//             "震央緯度": [
//                 24.81,
//                 21.91,
//                 24.45,
//                 22.5,
//                 22.88
//             ],
//             "震央規模": [
//                 4.01,
//                 3.93,
//                 2.86,
//                 4.1,
//                 3.77
//             ],
//             "震央深度": [
//                 13.72,
//                 32.39,
//                 17.38,
//                 24.58,
//                 15.67
//             ],
//             "震央震度階級": [
//                 2,
//                 2,
//                 4,
//                 2,
//                 3
//             ]
//         }
//     ]
// }


// let Data = res['data']
// let raw_data = []

// for (let i=0;i<Data[0]["時間"].length;i++) {
//     let tmp_data = {}
//     let tmp_pos = []
//     tmp_data["時間"] = Data[0]["時間"][i]
//     tmp_data["震度階級"] = Data[0]["震度階級"][i]
//     tmp_pos.push(Data[0]["震央緯度"][i])
//     tmp_pos.push(Data[0]["震央經度"][i])
//     tmp_data["震央經緯度"] = tmp_pos
//     tmp_data["震央規模"] = Data[0]["震央規模"][i]
//     tmp_data["震央深度"] = Data[0]["震央深度"][i]
//     tmp_data["震央震度階級"] = Data[0]["震央震度階級"][i]
//     raw_data.push(tmp_data)
// }
// console.log("r", raw_data)

const EarthquakePage=()=>{
    
    
    let Page = "Earthquake"

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
        let earthquake_regions = []
        if(area==="north"){
            earthquake_regions = ["北"]
        }
        else if(area ==="center"){
            earthquake_regions = ["中"]
        }
        else{
            earthquake_regions = ["南"]
        }

        let body = {
            year_to: 2023,
            month_to: 6,
            day_to: 7,
            hour_to: 12,
            past_months: 25,
            earthquake_regions: earthquake_regions
        }

        fetch("http://127.0.0.1:8400/earthquake_fetch/", {
            method: 'POST',
            body: JSON.stringify(body),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
        .then(res => {          
            let Data = res['data']
            let raw_data = []

            for (let i=0;i<Data[0]["時間"].length;i++) {
                let tmp_data = {}
                let tmp_pos = []
                tmp_data["時間"] = Data[0]["時間"][i]
                tmp_data["震度階級"] = Data[0]["震度階級"][i]
                tmp_pos.push(Data[0]["震央緯度"][i])
                tmp_pos.push(Data[0]["震央經度"][i])
                tmp_data["震央經緯度"] = tmp_pos
                tmp_data["震央規模"] = Data[0]["震央規模"][i]
                tmp_data["震央深度"] = Data[0]["震央深度"][i]
                tmp_data["震央震度階級"] = Data[0]["震央震度階級"][i]
                // console.log("raw_data", tmp_data )
                raw_data.push(tmp_data)
            }
            console.log("r", raw_data)
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
                        <Col sm>
                            <div> 
                                <MapContainer
                                    center={center}
                                    zoom = {9}
                                    style ={{ width: '50vw', height: '80vh'}}
                                >
                                    <TileLayer
                                        url = "https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=Dt8im9lnEKjCm1fOF6od"
                                        attribution = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                                    >
                                    </TileLayer>
                                    {rawdata.map((item) => (
                                        <Marker position={item.震央經緯度}>
                                            <Popup>
                                                日期: {item.時間} <br /> 
                                                震度階級: {item.震度階級} <br />                                        
                                                經緯度: {item.震央經緯度[0]} {item.震央經緯度[1]}<br />
                                                規模: {item.震央規模} <br />
                                                深度: {item.震央深度} <br />
                                                震央震度階級: {item.震央震度階級}
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            </div>
                        </Col>
                        <Col>
                        <table className="table earthquakeInfoTable">
                            <thead>
                                <tr>
                                    <th>日期</th>
                                    <th>經度</th>
                                    <th>緯度</th>
                                    <th>規模</th> 
                                    <th>深度</th>
                                </tr>
                            </thead>
                            {rawdata.map((item) => (
                                <tbody>
                                    <tr className="btnInfo">
                                    <td>{item.時間}</td>
                                    <td>{item.震央經緯度[1]}</td>
                                    <td>{item.震央經緯度[0]}</td>
                                    <td>{item.震央規模}</td>
                                    <td>{item.震央深度}</td>
                                    </tr>
                                </tbody>                  
                            ))}
                
                        </table>
                        </Col>
                    </Row>
                </Container>
            </main>
        </>
      );
}

export default EarthquakePage;
