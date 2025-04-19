interface LoaderProps {
  loading: boolean;
  children: React.ReactNode;
}

export const Loader: React.FC<LoaderProps> = ({ loading, children }) => {
  return (
    <>
      {loading ? (
        <div className="w-screen h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-secondary border-solid"></div>
        </div>
      ) : (
        children
      )}
    </>
  );
};
