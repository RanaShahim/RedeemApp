import romanceData from '../romance-data.json';
import Romance from '../classes/Romance';

export default function mapRomanceData(): Romance[] {
    const result = [] as Romance[];
    romanceData.map((romanceRecord) => {
        result.push(
            new Romance(
                romanceRecord?.id,
                romanceRecord?.title,
                romanceRecord?.quote,
                romanceRecord?.redeemedResult,
                romanceRecord?.imageUrl,
                parseInt(romanceRecord?.points as any),
            ),
        );
    });
    return result;
}
