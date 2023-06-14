<div class="layout">
    <nav>
        <ul>
            <li>
                <a href="/">home</a>
                <a href="chess">chess</a>
                <a href="about">about</a>
            </li>
        </ul>
    </nav>
    <slot></slot>
</div>


<style>
    .layout {
        display: grid;
        grid-template-columns: 250px 1fr
    }

    nav {
        position: relative;
        margin-top: 200px;
    }

    nav::after {
        content: "";
        position: absolute;
        top: -100px;
        bottom: -100px;
        right: 0px;
        border-right: 3px solid #d3d3d3;
        border-radius: 10px;
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    li {
        display: flex;
        row-gap: 50px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    a {
        display: inline-block;
        font-size: 40px;
        font-family: Helvetica;
        font-weight: lighter;
        text-decoration: none;
        padding: 10px 20px;
        /*border: 1px solid #d3d3d3;*/
        /*border-radius: 10px;*/
        color: #2c1252;
        transition: color 0.3s ease;
        position: relative;
        z-index: 1;
    }

    a:hover {
        color: white;
    }

    a::before {
        position: absolute;
        content: "";
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-image: linear-gradient(
                to left top,
                #FF00CEFF,
                #7f99ff
        );
        z-index: -1;
        transition: opacity 0.3s linear;
        opacity: 0;
        border: 1px solid #ffffff;
        border-radius: 10px;
    }

    a:hover::before {
        opacity: 0.7;
    }
</style>