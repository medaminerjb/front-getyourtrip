
import React from 'react';
import { Modal } from "react-bootstrap";

interface ModalProps {
  show: boolean;
  handleClose: () => void;
}


const SignInModal: React.FC<ModalProps> = ({show,handleClose}) => {
  
  return (
    <Modal show={show}   centered className='modal login-modal' id="user-login">
                <div className="modal-clode-btn" data-bs-dismiss="modal" onClick={()=>handleClose()}></div>
                <div className="modal-header">
                    <img src="img/home1/login-modal-header-img.jpg" alt=""/>
                </div>
                <div className="modal-body">
                    <div className="login-registration-form">
                        <div className="form-title">
                            <h2>Sign in to continue</h2>
                            <p>Enter your email address for Login.</p>
                        </div>
                        <form>
                            <div className="form-inner mb-20">
                                <input type="text" placeholder="User name or Email *"/>
                            </div>
                            <a href="#" className="login-btn mb-25">Sign In</a>
                            <div className="divider">
                                <span>or</span>
                            </div>
                            <a href="#" className="google-login-btn">
                                <div className="icon">
                                    <img src="assets/img/home1/icon/google-icon.svg" alt=""/>
                                </div>
                                Sign in with Google
                            </a>
                        </form>
                    </div>
                </div>
    </Modal>
  );
};

export default SignInModal;
