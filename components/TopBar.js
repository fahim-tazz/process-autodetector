import styles from "@/styles/topBar.module.css";

const TopBar = (props) => {
    const folders = ["Reacta", "Manufacturing", "Process Autodetector", "Trainer"];
    return (
        <div className="topBar">
          {folders.map((folder, index) => (
            <span key={index} className="folder">
              {folder}
              {index < folders.length - 1 && <span className="separator"> &gt; </span>}
            </span>
          ))}
        </div>
      );
};


export default TopBar;