import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    redirect
} from '@remix-run/node';
import { Form, Link } from '@remix-run/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { loginSchema } from '~/utils/validations';
import { getUser, login } from '~/utils/auth.server';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { Button, Container, TextField } from '@radix-ui/themes';
import { Paths } from '../utils/constants';

export async function loader({ request }: LoaderFunctionArgs) {
    return (await getUser(request)) ? redirect(Paths.DASHBOARD) : null;
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const submission = parseWithZod(formData, { schema: loginSchema });

    console.log(Object.fromEntries(formData));

    // Report the submission to client if it is not successful
    if (submission.status !== 'success') {
        return submission.reply();
    }

    return await login(submission.value);
}

export default function Route() {
    const [form, fields] = useForm({
        constraint: getZodConstraint(loginSchema),
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput'
    });

    return (
        <Container className="pt-12">
            <h1 className="text-4xl font-bold mb-8">Login</h1>
            <Form
                method="POST"
                {...getFormProps(form)}
                className="space-y-3 mb-8"
            >
                <div className="space-y-2">
                    <label htmlFor="email">Email</label>
                    <TextField.Root
                        // placeholder="Search the docs…"
                        {...getInputProps(fields.email, { type: 'email' })}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="password">Password</label>
                    <TextField.Root
                        // placeholder="Search the docs…"
                        {...getInputProps(fields.password, {
                            type: 'password'
                        })}
                    />
                </div>
                <Button type="submit">Sign in</Button>
            </Form>
            <p>
                {`Don't have an account?`}
                <Link to="/join" className="pl-2 text-blue-500">
                    Click to join
                </Link>
            </p>
        </Container>
    );
}
