import React from "react";

const Header = () => {
      return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 25px",
        background: "#f5f5f5",
        borderBottom: "1px solid #ddd"
      }}
    >
      {/* Logo */} 
      <div style={{ fontSize: "22px", fontWeight: "bold" }}>
        <span style={{
          display: "inline-block",
          width: "35px",
          height: "35px",
          background: "#ccc",
          borderRadius: "5px",
          marginRight: "10px",
          verticalAlign: "middle"
        }}></span>
        MyLogo
      </div>

      {/* Navigation Links */}
      <nav>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            gap: "20px",
            margin: 0,
            padding: 0
          }}
        >
          <li><a href="/" style={{ textDecoration: "none", color: "#333" }}>Home</a></li>
          <li><a href="/about" style={{ textDecoration: "none", color: "#333" }}>About</a></li>
          <li><a href="/services" style={{ textDecoration: "none", color: "#333" }}>Services</a></li>
          <li><a href="/contact" style={{ textDecoration: "none", color: "#333" }}>Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;


