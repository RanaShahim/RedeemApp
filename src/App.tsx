import { useEffect, useState } from 'react';
import './App.css';
import mapRomanceData from './mappers/rommanceMapper';
import Romance from './classes/Romance';

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
            setRomanceRecord(newRecord);
        } else {
            if (defaultRecord) {
                setRomanceRecord(defaultRecord);
            }
        }
    };

    const toggleApplicationState = (): void => {
        setHasAlreadyRedeemed(false);
        localStorage.setItem('hasAlreadyRedeemed', JSON.stringify(false));
        resetState();
    };

    const resetState = (): void => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const timeUntilTomorrow = tomorrow.getTime() - now.getTime();
        setTimeout(() => {
            const data = mapRomanceData();
            const redeemableRecords = data.filter(
                (record) => record?.getId() !== 'default',
            );
            const newIndex = Math.floor(
                Math.random() * redeemableRecords.length,
            );
            setCurrentIndex(newIndex);
            localStorage.setItem('currentIndex', newIndex.toString());
            setHasAlreadyRedeemed(true);
            localStorage.setItem('hasAlreadyRedeemed', JSON.stringify(true));
        }, timeUntilTomorrow);
    };

    useEffect(() => {
        setRomanceData();
        if (!hasAlreadyRedeemed) {
            resetState();
        }
    }, [hasAlreadyRedeemed]);

    return (
        <>
            <div className="card">
                <h3 className="heading">Daily Romance</h3>
                <div className="image">
                    <img
                        src={`./src/assets/images/${romanceRecord?.getImageUrl()}`}
                    ></img>
                </div>
                <p className="text">~~ {romanceRecord?.getTitle()} ~~</p>
                <p className="text">{`"${romanceRecord?.getQuote()}"`}</p>
                <h3 className="text">{romanceRecord?.getRedeemedResult()}</h3>
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
