interface LoaderProps {
  loading: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ loading }) => {
  return (
    <>
      {loading && (
        <div className="w-screen h-screen flex items-center justify-center z-index-10">
          <img src="/icons/logo.png" className="w-24 h-24 animate-pulse" />
        </div>
      )}
    </>
  );
};
