import React from "react";
import nevoLogo from '../images/nevo-logo.png';

const Header = () => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "15px 25px",
      }}
    >
      {/* Logo */}
      <div style={{ fontSize: "22px", fontWeight: "bold" }}>
        <img src={nevoLogo} alt="Nevo Logo" style={{ height: "50px", verticalAlign: "middle" }} />
      </div>
    </header>
  );
}

export default Header;


