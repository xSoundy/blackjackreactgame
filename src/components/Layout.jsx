import React from "react";

const Layout = ({children}) => {
    return (
        <div>
            <header>
                <h1>Blackjack Game</h1>
            </header>
            <main>{children}</main>
            <footer>
                <p>© 2025 Blackjack Inc.</p>
            </footer>
        </div>
    )
}

export default Layout;