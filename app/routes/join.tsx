import { ActionFunctionArgs, json } from '@remix-run/node';
import { Form, Link } from '@remix-run/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { signUpSchema } from '~/utils/validations';
import { login } from '~/utils/auth.server';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import {
    Button,
    Container,
    Heading,
    TextField,
    Link as RadixLink
} from '@radix-ui/themes';

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const submission = parseWithZod(formData, { schema: signUpSchema });

    // Report the submission to client if it is not successful
    if (submission.status !== 'success') {
        return submission.reply();
    }

    return await login(submission.value);
}

export async function loader() {
    return json({ count: 1 });
}

export default function JoinRoute() {
    const [form, fields] = useForm({
        constraint: getZodConstraint(signUpSchema),
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput'
    });

    return (
        <Container>
            <div className="max-w-lg mx-auto border dark:border-zinc-700 p-4 rounded-lg bg-white dark:bg-zinc-800">
                <Heading as="h1" className="text-4xl font-bold mb-8">
                    Join
                </Heading>
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
                    <Button type="submit" variant="solid">
                        Sign in
                    </Button>
                </Form>
                <p>
                    {`Don't have an account? `}
                    <RadixLink asChild>
                        <Link to="/join" className="pl-2">
                            Click to join
                        </Link>
                    </RadixLink>
                </p>
            </div>
        </Container>
    );
}
