import { Form, Modal, Button } from "react-bootstrap";
import { User } from "../models/user";
import { LoginCredentials } from "../network/user_api";
import * as UserApi from "../network/user_api";
import { useForm } from "react-hook-form";
import TextInputField from "./form/TextInputField";
import stylesUtils from '../styles/utils.module.css'
interface LoginModalProps {
    onDismiss: () => void,
    onLoginSuccessful: (user: User) => void
}
const LoginModal = ({ onDismiss, onLoginSuccessful }: LoginModalProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>();

    async function onSubmit(credentials: LoginCredentials) {
        try {
            const user = await UserApi.login(credentials);
            onLoginSuccessful(user)
        } catch (error) {
            alert(error)
            console.error(error)

        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Login
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="username"
                        label="Username"
                        type="text"
                        placeholder="Username"
                        register={register}
                        registerOptions={{ required: 'Required' }}
                        error={errors.username}
                    />
                    <TextInputField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Password"
                        register={register}
                        registerOptions={{ required: 'Required' }}
                        error={errors.password}
                    />
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={stylesUtils.width100}
                    >
                        Login
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default LoginModal;