import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import { Button,Carousel,Image,Row,Col,Container} from 'react-bootstrap';

const EntryPage=()=>{
    const images = [
        'image1.png',
        'image2.jpg',
        'image3.jpg',
      ];
    const StyleSheet={
        width:"100vw",
        height:"100vh",
        backgroundColor:"#FF2E63",
        display: "flex",
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"column"
    }
    return(
        <>
        <Container fluid style={{position: 'relative',backgroundColor: 'blue', height: '100vh', overflow: 'hidden' }}>
        <Row>
            <Col sm={9} style={{ backgroundColor: "#FF2E63", height: '100vh', overflow: 'hidden',zIndex: 0 }}>
                <Carousel className="hide-arrows" interval={2000} fade style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    {images.map((image, index) => (
                        <Carousel.Item key={index} style={{width:"100vw",height:"100vh",display: "flex"}}>
                            <img src={image} alt={`Slide ${index + 1}`} />                   
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Col>
            <Col sm={3} style={{ backgroundColor: "#FF2E63", height: '100vh',display: 'flex', alignItems: 'center',justifyContent:"center",
        flexDirection:"column",zIndex: 1}}>
                <h1 style={{color:"white",fontFamily:"Microsoft JhengHei"}}>Meteorological center </h1>
                <div style={{height:"15px"}}></div>
                <Button  class="btn btn-light btn-lg" href="/earthquake">Entry</Button>
            </Col>
        </Row>
        </Container>
        </>
    )
}

export default EntryPage;