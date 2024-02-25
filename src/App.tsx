import { useEffect, useState } from 'react';
import './App.css';
import mapRomanceData from './mappers/rommanceMapper';
import Romance from './classes/Romance';
import { Blurhash } from 'react-blurhash';

function App() {
    const [romanceRecord, setRomanceRecord] = useState<Romance | null>(null);
    const [hasAlreadyRedeemed, setHasAlreadyRedeemed] = useState(
        JSON.parse(localStorage.getItem('hasAlreadyRedeemed') as any) ?? true,
    );
    const [currentIndex, setCurrentIndex] = useState<number>(
        (() => {
            const storedIndex = localStorage.getItem('currentIndex');
            return storedIndex ? parseInt(storedIndex, 10) : 2;
        })(),
    );

    const [totalPoints, setTotalPoints] = useState<number>(
        (() => {
            const storedPoints = localStorage.getItem('totalPoints');
            return storedPoints ? parseInt(storedPoints) : 0;
        })(),
    );

    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState('');

    const setRomanceData = (): void => {
        const data = mapRomanceData();
        const defaultRecord = data.find(
            (record) => record?.getId() === 'default',
        );
        const redeemableRecords = data.filter(
            (record) => record?.getId() !== 'default',
        );

        if (!hasAlreadyRedeemed) {
            const newRecord = redeemableRecords[currentIndex];
            //This function is run anytime hasAlreadyRedeemed changes (when we click the redeem treat button), so we want to set the total in localStorage straight away
            //and then read and when the hasAlreadyRedeemed is set to true again and the default page appears line 18 is run to reset
            //the state. We can set the total the onclick event or here in the function.
            localStorage.setItem('totalPoints', totalPoints.toString());
            setImageSrc(`./images/${newRecord?.getImageUrl()}`);
            setRomanceRecord(newRecord);
            setImageLoaded(false);
        } else {
            if (defaultRecord) {
                setRomanceRecord(defaultRecord);
                setImageSrc(`./images/${defaultRecord?.getImageUrl()}`);
                setImageLoaded(false);
            }
        }
    };

    const toggleApplicationState = (): void => {
        setHasAlreadyRedeemed(false);
        //Set the default state to false so we can see the treat that was redeemded.
        localStorage.setItem('hasAlreadyRedeemed', JSON.stringify(false));
        const redeemableRecords = fetchRedeemableData();
        const newIndex = Math.floor(Math.random() * redeemableRecords.length);
        setCurrentIndex(newIndex);
        const newRecord = redeemableRecords[newIndex];
        //Set the new index everytime so when line 49 triggers a rerender, the state is updated.
        localStorage.setItem('currentIndex', newIndex.toString());
        setTotalPoints(
            totalPoints > 99 ? 0 : totalPoints + newRecord?.getPoints(),
        );
    };

    const resetState = (): void => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const timeUntilTomorrow = tomorrow.getTime() - now.getTime();
        localStorage.setItem('resetTime', tomorrow.getTime().toString());
        setTimeout(() => {
            setHasAlreadyRedeemed(true);
            localStorage.setItem('hasAlreadyRedeemed', JSON.stringify(true));
        }, timeUntilTomorrow);
    };

    const fetchRedeemableData = (): Romance[] => {
        const data = mapRomanceData();
        const redeemableRecords = data.filter(
            (record) => record?.getId() !== 'default',
        );
        return redeemableRecords;
    };

    useEffect(() => {
        setRomanceData();
        if (!hasAlreadyRedeemed) {
            resetState();
        }
    }, [hasAlreadyRedeemed]);

    //This useEffect always runs after the first one because setRomanceData updates the imageSrc.
    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setImageLoaded(true);
        };
        img.src = imageSrc;
    }, [imageSrc]);

    useEffect(() => {
        const storedResetTime = localStorage.getItem('resetTime');
        const now = new Date().getTime();
        // Check if the reset time has passed and reset the state if needed
        if (storedResetTime && parseInt(storedResetTime, 10) <= now) {
            setHasAlreadyRedeemed(true);
            localStorage.setItem('hasAlreadyRedeemed', JSON.stringify(true));
            resetState(); // Optionally, reset the state for the next day
        } else {
            // Schedule the resetState function for midnight
            resetState();
        }
    }, []);

    return (
        <>
            <div className="card">
                <h3 className="heading">Daily Romance</h3>
                <div className="image">
                    {!imageLoaded && (
                        <Blurhash
                            hash="LOE_:4%2O9WB~C-oM}WCjM%2V]ay"
                            width={200}
                            height={200}
                            resolutionX={32}
                            resolutionY={32}
                            punch={1}
                        ></Blurhash>
                    )}
                    {imageLoaded && <img src={imageSrc}></img>}
                </div>
                <p className="text">~~ {romanceRecord?.getTitle()} ~~</p>
                <p className="text">{`"${romanceRecord?.getQuote()}"`}</p>
                <h3 className="text">{romanceRecord?.getRedeemedResult()}</h3>
                {hasAlreadyRedeemed && (
                    <h3 className="text">😘 Romance Points {totalPoints} 😘</h3>
                )}
                {hasAlreadyRedeemed && (
                    <button className="button" onClick={toggleApplicationState}>
                        Redeem your everyday treat 🎉😘
                    </button>
                )}
            </div>
        </>
    );
}
export default App;
