import { Button } from "./Button";
import { RoundButton } from "./RoundButton";
import { TextCounter } from "./TextCounter";

interface FlashcardHomepageProps {
  numberOfCards: number;
  setIsFlashcardReviewOpened(isOpened: boolean): void;
  setIsFlashcardAdderOpened(isOpened: boolean): void;
}

export const FlashcardHomepage: React.FC<FlashcardHomepageProps> = ({
  numberOfCards,
  setIsFlashcardReviewOpened,
  setIsFlashcardAdderOpened,
}) => {
  return (
    <>
      {numberOfCards > 0 ? (
        <>
          <TextCounter
            text={"Nombre de cartes à réviser aujourd'hui :"}
            counter={numberOfCards}
          />
          <Button
            variant="primary"
            onClick={() => setIsFlashcardReviewOpened(true)}
          >
            Apprendre
          </Button>
        </>
      ) : (
        <p>
          Il ne reste aucune carte à réviser aujourd'hui, tu as mérité un café !
        </p>
      )}
      <RoundButton
        onClick={() => setIsFlashcardAdderOpened(true)}
        position="right"
      >
        +
      </RoundButton>
    </>
  );
};
