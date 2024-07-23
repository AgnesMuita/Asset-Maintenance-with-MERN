import { makeFallBack } from "@/utils/make.fallback";
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
import { ArrowRightIcon } from "lucide-react";

const AccessAccount = ({ sender }: { sender: IUserProps }) => {
    return (
        <>
            {sender && (
                <Html>
                    <Head />
                    <Preview>{sender.fullName} is unable to access their account on Deer </Preview>
                    <Tailwind>
                        <Body className="bg-white my-auto mx-auto font-sans px-2">
                            <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                                <Section className="mt-[32px]">
                                    <Img
                                        src="http://localhost:5173/src/assets/logo.png"
                                        width="40"
                                        height="37"
                                        alt="Vercel"
                                        className="my-0 mx-auto"
                                    />
                                </Section>
                                <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                                    <strong>{sender.fullName}</strong> is unable to access their account.
                                </Heading>
                                <Text className="text-black text-[14px] leading-[24px]">
                                    Hello Mike Oxlong,
                                </Text>
                                <Text className="text-black text-[14px] leading-[24px]">
                                    <strong>{sender.fullName}</strong> (
                                    <Link
                                        href={`mailto:kmcboo@gmail.com`}
                                        className="text-blue-600 no-underline"
                                    >
                                        {sender.email}
                                    </Link>
                                    ) is unable to access their account on <strong>Deer</strong>
                                </Text>
                                <Section>
                                    <Row>
                                        <Column align="right">
                                            <Img
                                                className="rounded-full"
                                                src={sender.avatar ?? makeFallBack(sender.firstName, sender.lastName)}
                                                width="64"
                                                height="64"
                                            />
                                        </Column>
                                        <Column align="center">
                                            <ArrowRightIcon />
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
                                        href={`http://localhost:5173/users/user-details/${sender.id}`}
                                    >
                                        Reset Password
                                    </Button>
                                </Section>
                                <Text className="text-black text-[14px] leading-[24px]">
                                    or copy and paste this URL into your browser:{" "}
                                    <Link href="http:localhost:5173/users/chd93984932" className="text-blue-600 no-underline">
                                        http://localhost:5173/users/user-details/${sender.id}
                                    </Link>
                                </Text>
                                <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                                <Text className="text-[#666666] text-[12px] leading-[24px]">
                                    This email was intended for{" "}
                                    <span className="text-black">Mike Oxlong</span>. This email was
                                    sent from <span className="text-black">{sender.email}</span>{" "}
                                    of department{" "}
                                    <span className="text-black">Finance</span>. If you
                                    were not expecting this email, you can ignore this email. If
                                    you are concerned about your account's safety, please reply to
                                    this email to get in touch with us.
                                </Text>
                            </Container>
                        </Body>
                    </Tailwind>
                </Html>
            )}
        </>
    )
}

export default AccessAccount;
