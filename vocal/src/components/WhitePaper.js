import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap';
import PdfViewer from './data/PdfViewer';

export default class WhitePaper extends Component {

 
    render() {
        const self = this;
        return (
            <div>
                <Col xsHidden md={3} />

                <Col xs={12} md={6}>
                    <div className="centered">
                        <PdfViewer/>
                    </div>
                </Col>

                <Col xsHidden md={3} />
            </div>
        )
    }
}
