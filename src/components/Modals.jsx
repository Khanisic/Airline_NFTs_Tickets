import React from 'react'
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";

function Modals({  mintNfts, modal, setModal, check, buttons, title, setHeader, children, setStep, step }) {
    return (
        <Modal
            blur
            closeButton
            aria-labelledby="modal-title"
            open={modal}
            onClose={() => { setModal(false); setStep(0) }}
            css={{ paddingTop: "0" }}
        >
            <Modal.Header css={{ backgroundColor: "#E0D817", paddingTop: "16px" }}>
                <p className='text-xl font-semibold'>{title}</p>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer justify='center'>
                <div className='flex gap-4'>
                    {
                        step == 0 &&
                        <div onClick={() => { setStep((prev) => prev + 1) }} className='bg-blue px-4 py-2 rounded-xl cursor-pointer'>
                            <p className='text-whiteTwo'>{buttons[1]}</p>
                        </div>
                    }
                    {
                        step == 1 &&
                        <>
                            <div onClick={() => { setStep((prev) => prev - 1) }} className='bg-whiteTwo px-4 py-2 rounded-xl cursor-pointer'>
                                <p className='text-blue'>{step == 0 ? buttons[0] : buttons[2]}</p>
                            </div>
                            {
                                check ?
                                    <div onClick={() => { step == 2 ? setModal(false) : setStep((prev) => prev + 1) }} className='bg-blue px-4 py-2 rounded-xl cursor-pointer'>
                                        <p className='text-whiteTwo'>{buttons[3]}</p>
                                    </div>
                                    :
                                    <div className='bg-gray-300 px-4 py-2 rounded-xl  cursor-not-allowed'>
                                        <p className='text-whiteTwo'>{buttons[3]}</p>
                                    </div>
                            }
                        </>
                    }
                    {
                        step == 2 &&
                        <>
                            <div onClick={() => { mintNfts() }} className='bg-blue px-4 py-2 rounded-xl cursor-pointer'>
                                <p className='text-whiteTwo'>{buttons[4]}</p>
                            </div>
                        </>
                    }
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default Modals