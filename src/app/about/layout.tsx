export const metadata = {
    title: "About Us | StayNJoy Homestay Tinsukia",
    description: "Learn about StayNJoy Homestay in Tinsukia. We offer cozy rooms, couple-friendly suites with projectors, and full 2BHK/4BHK houses for parties and family stays.",
    alternates: {
        canonical: "/about"
    }
}

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
