const TwitchEmbed = ({ channel }: { channel: string }) => {
  const extensionId = chrome.runtime.id;
  console.log(extensionId);
  return (
    <iframe
      src={`https://player.twitch.tv/?channel=${channel}&parent=localhost`}
      height="400"
      width="100%"
      allowFullScreen
      className="mt-2"
    ></iframe>
  );
};

export default TwitchEmbed;
