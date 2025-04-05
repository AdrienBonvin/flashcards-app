
interface FlashcardViewerProps {
    id: string;
    question: string;
    answer: string;
    reviewCount: number;
    reviewDate: Date;
    markAsReviewed: (id: string, reviewCount: number, reviewDate: Date) => void;
    markAsFailed: (id: string) => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
    question,
    answer,
    id,
    reviewCount,
    reviewDate,
    markAsReviewed,
    markAsFailed
}) => {
return(
   <div className="w-screen h-[80vh] bg-blue-400"> 
       <div >{question}</div>
       <div>{answer}</div>
        <button onClick={() => markAsReviewed(id, reviewCount, reviewDate)}>{`GOOD ${reviewCount}`}</button>
        <button onClick={() => markAsFailed(id)}>{`BAD ${reviewCount}`}</button>
</div>)
}