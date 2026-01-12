import bell from '../assets/icons/notif.svg';
import help from '../assets/icons/help.svg';
import Image from 'next/image';

const Header = () => {
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <header className="flex justify-between items-center w-full h-20 bg-[#147d73] px-6">
            {/* Left Side */}
            <div className="flex flex-col items-start">
                <p className="text-white text-lg font-medium">Hello, Abhishek</p>
                <p className="text-white text-xs font-medium">{date}</p>
            </div>
            {/* Right Side */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Image src={bell} alt="bell" width={40} height={40} />
                    <Image src={help} alt="help" width={40} height={40} />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                        <p className="text-white text-sm font-medium">Abhishek Tomar</p>
                        <p className="text-white text-xs font-medium">Heaps Normal</p>
                    </div>
                    {/* Profile Picture */}
                    <div className="w-10 h-10 bg-white rounded-full"></div>
                </div>
            </div>
        </header>
    )
}

export default Header