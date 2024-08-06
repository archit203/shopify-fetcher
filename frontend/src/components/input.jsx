import { useState } from "react";
import Loader from "./loader";

export default function Input() {
    const [url, setUrl] = useState("");
    const [click, setClick] = useState(false);
    const [data, setData] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);

    const handleClick = async () => {
        setClick(true);
        setData([]);
        console.log(url);
        try {
            const response = await fetch("http://localhost:5000/fetch_result", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url })
            });

            const data = await response.json();
            console.log(data);
            setData(data.cardData);

        } catch (e) {
            console.log(e);
        }

        setClick(false);
    }

    const handleCardClick = (item) => {
        setSelectedCard(item);
    }

    const handleCloseModal = () => {
        setSelectedCard(null);
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden h-screen">
            <div className="flex justify-center items-center h-16 md:h-20 px-4 bg-white z-10">
                <input
                    type="text"
                    className="border-2 border-gray-300 bg-white h-10 px-4 md:px-5 rounded-lg text-sm focus:outline-none w-full md:w-2/3"
                    placeholder="Enter URL"
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button
                    className="bg-gray-600 hover:bg-black text-white font-bold py-2 px-4 rounded ml-4"
                    onClick={handleClick}
                >
                    <span>Search</span>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {click && <div className="absolute inset-0 flex items-center justify-center z-10"><Loader /></div>}
                {!click && data.length > 0 && (
                    <div className="flex flex-col items-center space-y-5">
                        {data.map((item) => (
                            <div
                                key={item.imageUrl}
                                className="flex flex-col md:flex-row w-full max-w-4xl bg-[#eae3db] hover:bg-[#D1D9E0] rounded-lg shadow-lg cursor-pointer"
                                onClick={() => handleCardClick(item)}
                            >
                                {/* Image Area */}
                                <div className="relative w-full md:w-1/3 flex-shrink-0">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.productTitle}
                                        className="w-full h-40 md:h-full object-cover"
                                    />
                                </div>
                                {/* Content Area */}
                                <div className="flex flex-col p-4 w-full md:w-2/3 items-center justify-center">
                                    <h1 className="text-lg font-bold text-center md:text-left">{item.productTitle}</h1>
                                    <ul className="list-disc list-inside text-sm mt-2">
                                        {item.productDescription.map((desc, index) => (
                                            <li key={index} className="m-1">{desc.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {selectedCard && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
                    <div
                        className="bg-white rounded-lg shadow-lg overflow-y-auto relative"
                        style={{
                            width: '75vw',  // 3/4 width
                            height: '50vh',  // 1/2 height
                        }}
                    >
                        <button
                            className="absolute top-2 right-2 bg-gray-600 hover:bg-black text-white font-bold py-1 px-3 rounded z-30"
                            onClick={handleCloseModal}
                        >
                            Close
                        </button>
                        <div className="flex flex-col md:flex-row h-full">
                            {/* Image Area */}
                            <div className="relative w-full md:w-1/2 flex-shrink-0">
                                <img
                                    src={selectedCard.imageUrl}
                                    alt={selectedCard.productTitle}
                                    className="w-full h-full"
                                />
                            </div>
                            {/* Content Area */}
                            <div className="flex flex-col p-4 w-full md:w-1/2 items-center justify-center">
                                <h1 className="text-lg font-bold text-center md:text-left">{selectedCard.productTitle}</h1>
                                <ul className="list-disc list-inside text-sm mt-2">
                                    {selectedCard.productDescription.map((desc, index) => (
                                        <li key={index} className="m-1">{desc.trim()}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
