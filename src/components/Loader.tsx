interface LoaderProps {
  loading: boolean;
  children: React.ReactNode;
}

export const Loader: React.FC<LoaderProps> = ({ loading, children }) => {
  return (
    <>
      {loading ? (
        <div className="w-screen h-screen flex items-center justify-center">
          <img
            src={"/public/icons/logo.png"}
            className="w-24 h-24 animate-pulse"
          />
        </div>
      ) : (
        children
      )}
    </>
  );
};
