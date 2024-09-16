import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    redirect
} from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { loginSchema } from '~/utils/validations';
import { getUser, login } from '~/utils/auth.server';
import {
    getFormProps,
    getInputProps,
    SubmissionResult,
    useForm
} from '@conform-to/react';
import {
    Button,
    Container,
    Heading,
    TextField,
    Link as RadixLink
} from '@radix-ui/themes';
import { Paths } from '../utils/constants';
import Divider from '~/components/Divider';

export async function loader({ request }: LoaderFunctionArgs) {
    return (await getUser(request)) ? redirect(Paths.DASHBOARD) : null;
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const submission = parseWithZod(formData, { schema: loginSchema });

    if (submission.status !== 'success') {
        return submission.reply();
    }

    return await login(submission.value);
}

export default function LoginRoute() {
    const lastResult = useActionData<typeof action>();

    const [form, fields] = useForm({
        constraint: getZodConstraint(loginSchema),
        lastResult: lastResult as SubmissionResult<string[]>
    });

    return (
        <Container>
            <div className="max-w-lg mx-auto border border-zinc-300 dark:border-zinc-700 p-4 rounded-lg bg-white dark:bg-zinc-800 my-8">
                <Heading as="h1" weight="bold" size="7" className="mb-8">
                    Login
                </Heading>
                <Form
                    method="POST"
                    {...getFormProps(form)}
                    className="space-y-4 mb-8"
                >
                    <div>
                        <label htmlFor="email">Email</label>
                        <TextField.Root
                            {...getInputProps(fields.email, {
                                name: 'email',
                                type: 'email'
                            })}
                        />
                        {lastResult?.error &&
                            (lastResult?.error as { email?: string }).email && (
                                <p className="text-red-500">
                                    {
                                        (
                                            lastResult?.error as {
                                                email?: string;
                                            }
                                        ).email
                                    }
                                </p>
                            )}
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <TextField.Root
                            {...getInputProps(fields.password, {
                                name: 'password',
                                type: 'password'
                            })}
                        />
                        {lastResult?.error &&
                            (lastResult?.error as { password?: string })
                                .password && (
                                <p className="text-red-500">
                                    {
                                        (
                                            lastResult?.error as {
                                                password?: string;
                                            }
                                        ).password
                                    }
                                </p>
                            )}
                    </div>
                    <Button type="submit" variant="solid">
                        Sign in
                    </Button>
                </Form>
                <Divider />
                <p className="py-2">
                    {`Don't have an account? `}
                    <RadixLink asChild>
                        <Link to="/join" className="pl-2 underline">
                            Click to join
                        </Link>
                    </RadixLink>
                </p>
            </div>
        </Container>
    );
}
