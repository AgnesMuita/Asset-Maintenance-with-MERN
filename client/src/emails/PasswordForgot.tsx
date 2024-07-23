import {
    Body,
    Button,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
    Tailwind
} from "@react-email/components";
import { LockKeyholeIcon } from "lucide-react";

const PasswordForgot = () => {
    return (
        <Html>
            <Head />
            <Preview>Password Reset request on Deer</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src="http://localhost:5173/src/assets/logo.png"
                                width="40"
                                height="37"
                                alt="Deer"
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            <strong>Kelly Mcboo</strong> wants their password reset.
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello Mike Oxlong,
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            <strong>Kelly Mcboo</strong> (
                            <Link
                                href={`mailto:kmcboo@gmail.com`}
                                className="text-blue-600 no-underline"
                            >
                                kmcboo@gmail.com
                            </Link>
                            ) is unable to access their account on <strong>Deer</strong> because they don't remember their password.
                        </Text>
                        <Section>
                            <Row>
                                <Column align="right">
                                    <Img
                                        className="rounded-full"
                                        src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20shape-rendering%3D%22crispEdges%22%3E%3Cdesc%3E%22Pixel%20Art%22%20by%20%22Florian%20K%C3%B6rner%22%2C%20licensed%20under%20%22CC0%201.0%22.%20%2F%20Remix%20of%20the%20original.%20-%20Created%20with%20dicebear.com%3C%2Fdesc%3E%3Cmetadata%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%3E%3Crdf%3ARDF%3E%3Ccc%3AWork%3E%3Cdc%3Atitle%3EPixel%20Art%3C%2Fdc%3Atitle%3E%3Cdc%3Acreator%3E%3Ccc%3AAgent%20rdf%3Aabout%3D%22https%3A%2F%2Fdicebear.com%22%3E%3Cdc%3Atitle%3EFlorian%20K%C3%B6rner%3C%2Fdc%3Atitle%3E%3C%2Fcc%3AAgent%3E%3C%2Fdc%3Acreator%3E%3Cdc%3Asource%3Ehttps%3A%2F%2Fwww.figma.com%2Fcommunity%2Ffile%2F1198754108850888330%3C%2Fdc%3Asource%3E%3Ccc%3Alicense%20rdf%3Aresource%3D%22https%3A%2F%2Fcreativecommons.org%2Flicenses%2Fzero%2F1.0%2F%22%20%2F%3E%3C%2Fcc%3AWork%3E%3C%2Frdf%3ARDF%3E%3C%2Fmetadata%3E%3Cmask%20id%3D%22w6sj6i8m%22%3E%3Crect%20width%3D%2216%22%20height%3D%2216%22%20rx%3D%220%22%20ry%3D%220%22%20x%3D%220%22%20y%3D%220%22%20fill%3D%22%23fff%22%20%2F%3E%3C%2Fmask%3E%3Cg%20mask%3D%22url(%23w6sj6i8m)%22%3E%3Crect%20fill%3D%22%23b6e3f4%22%20width%3D%2216%22%20height%3D%2216%22%20x%3D%220%22%20y%3D%220%22%20%2F%3E%3Cpath%20d%3D%22M4%202h8v1h1v3h1v2h-1v3h-1v1H9v1h4v1h1v2H2v-2h1v-1h4v-1H4v-1H3V8H2V6h1V3h1V2Z%22%20fill%3D%22%23a26d3d%22%2F%3E%3Cpath%20d%3D%22M4%202h8v1h1v3h1v2h-1v3h-1v1H4v-1H3V8H2V6h1V3h1V2Z%22%20fill%3D%22%23fff%22%20fill-opacity%3D%22.1%22%2F%3E%3Cpath%20fill%3D%22%23ffd700%22%20d%3D%22M13%207h1v2h-1zM2%207h1v2H2z%22%2F%3E%3Cpath%20fill%3D%22%23fff%22%20fill-opacity%3D%22.5%22%20d%3D%22M2%207h1v1H2zM13%207h1v1h-1z%22%2F%3E%3Cpath%20d%3D%22M4%2013h1v1h6v-1h1v3H4v-3Z%22%20fill%3D%22%23ffd969%22%2F%3E%3Cpath%20fill%3D%22%23fff%22%20fill-opacity%3D%22.3%22%20d%3D%22M9%2015h2v1H9z%22%2F%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M4%205h3v2H4zM9%205h3v2H9z%22%2F%3E%3Cpath%20fill%3D%22%235b7c8b%22%20d%3D%22M9%206h1v1H9zM4%206h1v1H4z%22%2F%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M14%205H2v1h1v2h4V7h2v1h4V6h1V5Zm-2%201H9v1h3V6ZM7%207H4V6h3v1Z%22%20fill%3D%22%234b4b4b%22%2F%3E%3Cpath%20fill%3D%22%23000%22%20fill-opacity%3D%22.3%22%20d%3D%22M4%206h3v1H4z%22%2F%3E%3Cpath%20fill%3D%22%23fff%22%20fill-opacity%3D%22.2%22%20d%3D%22M2%205h1v1H2zM7%205h2v1H7zM13%205h1v1h-1z%22%2F%3E%3Cpath%20fill%3D%22%23000%22%20fill-opacity%3D%22.3%22%20d%3D%22M9%206h3v1H9z%22%2F%3E%3Cpath%20d%3D%22M7%209v1h1v1h1V9H7Z%22%20fill%3D%22%23c98276%22%2F%3E%3Cpath%20d%3D%22M4%201v1H3v1H2v1H1v6h2V8H2V6h1V4h1V3h2v1h1V3h1V2H7V1H4Z%22%20fill%3D%22%23603015%22%2F%3E%3Cpath%20d%3D%22M4%200h8v1h1v1h1v2H2V2h1V1h1V0Z%22%20fill%3D%22%23cc6192%22%2F%3E%3Cpath%20fill%3D%22%23fff%22%20fill-opacity%3D%22.3%22%20d%3D%22M13%201v1H3V1zM14%203v1H2V3z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                                        width="64"
                                        height="64"
                                    />
                                </Column>
                                <Column align="center">
                                    <LockKeyholeIcon />
                                </Column>
                                <Column align="left">
                                    <Img
                                        className="rounded-full"
                                        src="http://localhost:5173/src/assets/logo.png"
                                        width="64"
                                        height="64"
                                    />
                                </Column>
                            </Row>
                        </Section>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href="#"
                            >
                                Reset Password
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            or copy and paste this URL into your browser:{" "}
                            <Link href="http:localhost:5173/users/chd93984932" className="text-blue-600 no-underline">
                                http://localhost:5173/users/chd93984932
                            </Link>
                        </Text>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            This email was intended for{" "}
                            <span className="text-black">Mike Oxlong</span>. This email was
                            sent from <span className="text-black">kmcboo@gmail.com</span>{" "}
                            of department{" "}
                            <span className="text-black">Finance</span>. If you
                            were not expecting this invitation, you can ignore this email. If
                            you are concerned about your account's safety, please reply to
                            this email to get in touch with us.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default PasswordForgot;
