import SubNav from "@/components/subnav";

const navs = [
    {
        link: '/porfo/creatives',
        name: 'Creatives',
    },
    {
        link: '/porfo/photos',
        name: 'Photos',
    },
];

export default function PorfoLayout({children}) {
    return (
        <div>
            <SubNav navs={navs}/>
            <div>
                {children}
            </div>
        </div>
    );
}