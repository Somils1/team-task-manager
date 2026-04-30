import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />

      <div style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "20px"
      }}>
        {children}
      </div>
    </div>
  );
}