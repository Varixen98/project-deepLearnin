import { SiPreact } from "react-icons/si";

export default function Navbar(){

    return(
        <div id="navbar-container" className="w-[85%] h-16 px-10 bg-white/10 backdrop-blur-md flex items-center justify-between mt-8 z-10 rounded-md">
            <div id="logo-container" className="flex w-fit h-fit gap-2 items-center justify-between text-white">
                <SiPreact size={48}/>
                <a href="/" className="font-archivo text-4xl text-white">Deep Learning</a>
            </div>

            <div id="menu-btn" className="flex w-fit h-full items-center gap-2 text-white font-archivo">
                <div className="flex items-center justify-center p-2 w-24 h-full hover:bg-white/50 rounded-md">
                    <a href="/docs">Docs</a>
                </div>
                <div className="flex items-center justify-center p-2 w-24 h-full hover:bg-white/50 rounded-md">
                    <a href="/about">About</a>
                </div>
            </div>
        </div>
    );
}