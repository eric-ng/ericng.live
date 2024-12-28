import SubNav from "@/components/subnav";

export default function PorfoLayout({children}) {
    return (
        <>
            <SubNav />
            {children}
        </>
    );
}