import React, { Component } from 'react'
import { Button, Modal } from 'react-bootstrap';
import LoginForm from './LoginForm';

import vocal from '../../assets/vocal_title.png';

export default class LoginModal extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Modal show={this.props.showModal} onHide={this.props.close}>
                    <Modal.Header closeButton>
                        <Modal.Title className="centered">Log into Vocal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="centered">
                            <img src={vocal} className="centered login-image"/>
                            <LoginForm onLogin={this.props.close}/>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.close}>Close</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}