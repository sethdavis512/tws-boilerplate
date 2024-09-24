import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    redirect
} from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { loginSchema } from '~/utils/validations';
import { createUserSession, getUser } from '~/utils/auth.server';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import {
    Button,
    Container,
    Heading,
    TextField,
    Link as RadixLink,
    Callout
} from '@radix-ui/themes';
import { Paths } from '../utils/constants';
import Divider from '~/components/Divider';
import { verifyLogin } from '~/models/user.server';
import { InfoIcon } from 'lucide-react';
import { safeRedirect } from '~/utils/routing';

export async function loader({ request }: LoaderFunctionArgs) {
    return (await getUser(request)) ? redirect(Paths.DASHBOARD) : null;
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const submission = parseWithZod(formData, { schema: loginSchema });
    const redirectTo = safeRedirect(
        formData.get('redirectTo'),
        Paths.DASHBOARD
    );

    const user = await verifyLogin(
        String(formData.get('email')),
        String(formData.get('password'))
    );

    if (submission.status !== 'success' || !user) {
        return submission.reply({
            formErrors: ['Incorrect username or password']
        });
    }

    return await createUserSession(user.id, redirectTo);
}

export default function LoginRoute() {
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || Paths.DASHBOARD;

    const lastResult = useActionData<typeof action>();

    const [form, fields] = useForm({
        id: 'loginForm',
        constraint: getZodConstraint(loginSchema),
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: loginSchema });
        }
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
                    <input type="hidden" name="redirectTo" value={redirectTo} />
                    <div className={form.errors ? 'block' : 'hidden'}>
                        <Callout.Root variant="soft" color="red">
                            <Callout.Icon>
                                <InfoIcon />
                            </Callout.Icon>
                            <Callout.Text>{form.errors}</Callout.Text>
                        </Callout.Root>
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <TextField.Root
                            {...getInputProps(fields.email, {
                                name: 'email',
                                type: 'email'
                            })}
                        />
                        {fields.email.errors && (
                            <p className="text-red-500">
                                {fields.email.errors}
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
                        {fields.password.errors && (
                            <p className="text-red-500">
                                {fields.password.errors}
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
