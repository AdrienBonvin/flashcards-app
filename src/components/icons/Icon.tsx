interface IconProps extends React.SVGProps<SVGSVGElement> {
  iconName: "deck" | "cards";
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ iconName, className }) => {
  let icon = <></>;
  switch (iconName) {
    case "deck":
      icon = (
        <svg
          version="1.0"
          viewBox="0 0 200 200"
          fill="currentColor"
          className={className}
        >
          <path d="M105 33.4C92.1 37.9 66.3 47 47.8 53.5 29.2 60 13.1 66.2 12 67.2c-2.4 2.2-2.6 7-.5 9.2 4.8 4.8 49.1 41.3 51.3 42.3 6.5 2.9 9.8 2 67.9-18.3 30.9-10.8 57.6-20.5 59.2-21.5 2.5-1.5 3.1-2.5 3.1-5.3 0-3.8-.4-4.2-34.8-33-16-13.4-19.8-15.6-25.9-15.6-2.1.1-14.3 3.8-27.3 8.4z" />
          <path d="M6 81.2c0 .7.6 2.3 1.3 3.5 1.4 2.5 47.7 41.7 52.2 44.1 1.9 1.1 5.5 1.6 10 1.7 6.6 0 10.4-1.2 63.3-19.8 31-10.8 57.7-20.4 59.3-21.3 2.9-1.4 4.9-4.8 4.9-8.1 0-1.3-.4-1.2-2.4.6-2.8 2.7 0 1.6-65.6 24.7-58.3 20.5-60.2 21-68.6 16.8-2.2-1-14.9-11.1-28.2-22.4C18.8 89.7 7.4 80.3 6.9 80.2c-.5-.2-.9.2-.9 1z" />
          <path d="M7 92.1c0 3.6.7 4.3 25.3 24.9 13.8 11.7 26.6 21.9 28.4 22.6 1.8.8 5.9 1.4 9.2 1.4 5.3 0 13.3-2.5 63-19.9 31.3-11 57.9-20.4 59-21 2.8-1.6 5.1-5.1 5.1-8v-2.4l-2.3 2.1C191.1 95.2 76.4 135 70.4 135c-8.9 0-11.1-1.4-37-23.2C19.7 100.2 8.2 90.3 7.8 89.6c-.4-.6-.8.5-.8 2.5z" />
          <path d="M7 102.8c0 3.5.4 3.8 32.4 30.5C57.5 148.5 59.7 150 64.7 151c3 .7 7.1.9 9.2.5 4.4-.8 110.9-37.9 116.7-40.6 4.1-1.9 6.4-5.2 6.4-9.1v-2.1l-2.3 2.1c-1.4 1.3-24.3 10-60.2 22.7-74.2 26.2-67.9 25.8-90.2 6.9-6.8-5.7-17.9-15.2-24.8-21C7.3 100.1 7 99.9 7 102.8z" />
          <path d="M7 112.7c0 1.8.7 3.8 1.5 4.7 3.8 3.7 49 41.3 51.4 42.6 1.7 1 5.2 1.4 10.1 1.4 7.1-.1 10.4-1.1 63.4-19.8 30.7-10.8 57.2-20.4 58.8-21.2 3-1.5 4.8-4.9 4.8-8.7-.1-1.9-.2-2-1.3-.7-.7.8-1.9 2.1-2.8 2.7-2 1.6-114 40.8-119.2 41.7-2.1.4-6.3.2-9.3-.4-5.1-1.1-7.2-2.6-28.2-20.2-12.5-10.5-24.2-20.4-25.9-22.1L7 109.6v3.1z" />
          <path d="M7 122.2c0 3 1 3.9 32.4 30.1C57.5 167.5 59.7 169 64.7 170c3 .7 7.1.9 9.2.5 4.4-.8 110.9-37.9 116.7-40.6 2.2-1.1 4.6-3.1 5.2-4.5 1.9-3.9 1.4-4.9-1.1-2.6-3.6 3.4-118.3 43.2-124.3 43.2-8.9 0-11.1-1.4-37-23.2-13.7-11.6-25.2-21.5-25.6-22.2-.5-.6-.8.1-.8 1.6z" />
        </svg>
      );
      break;
    case "cards":
      icon = (
        <svg
          version="1.0"
          viewBox="0 0 200 200"
          fill="currentColor"
          className={className}
        >
          <path d="M46 37C28.1 48.6 12.3 59.4 10.8 61c-3.5 3.8-3.5 7.1-.3 12.6 7.3 12.4 61 94.2 62.8 95.6 2.7 2.1 8.5 2.3 11.2.4 1.8-1.2 5.2-.4 32.2 8.1 20.5 6.5 30.9 9.4 32.6 8.9 5.8-1.4 6-2 24.2-59.5 9.6-30.5 17.5-56.3 17.5-57.3 0-3-2.6-7.3-5.2-8.4-1.3-.6-9.1-3.2-17.4-5.9l-15.1-4.8-.6-8.9c-.6-9.6-2.1-13.1-6.3-15-1.8-.9-8.4-.7-26.5.6-13.3.9-24.2 1.6-24.4 1.4-.1-.2-1.6-2.4-3.4-5-1.7-2.6-4.1-5.4-5.3-6.3-4.9-3.4-6.9-2.4-40.8 19.5zm38.5-10.4c.9 1.4 1.5 2.7 1.3 2.9-.8.7-15.2 1.6-14.5.8 1.6-1.6 9.2-6.2 10.3-6.2.7-.1 1.9 1.1 2.9 2.5zm59.9 10.5c1.1 5.5.7 11.2-.6 10.7-.7-.3-8.9-2.9-18.1-5.8-17.9-5.5-20.3-5.7-23.9-1.7-1.7 1.9-14.4 40.1-27.4 82.5-1.4 4.6-2.7 8.2-2.9 8-.9-.9-6.7-90-5.9-90.7.8-.8 60.2-5.7 72.5-6 5.6-.1 5.7-.1 6.3 3zM57 43.2c0 1.8 1.6 24.4 3.5 50.2 1.9 25.9 3.3 47.1 3.2 47.2-.5.5-46.9-71.7-47.1-73.2 0-1 7.2-6.4 19.4-14.4 10.7-7.1 19.8-12.9 20.3-12.9.4-.1.7 1.4.7 3.1zM146.5 57c19.3 6.1 35.4 11.5 35.9 12 .8.8-31.9 106-33.9 108.6-.9 1.3-6.8-.4-37.5-10-20-6.4-36.8-12-37.3-12.5-.8-.8 30.9-103.5 33.5-108.4.5-1.1 1.6-1.6 2.6-1.3.9.3 17.5 5.6 36.7 11.6z" />
        </svg>
      );
      break;
  }
  return <>{icon}</>;
};
