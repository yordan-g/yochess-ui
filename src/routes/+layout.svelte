<script>
</script>

<div class="layout">
    <nav>
        <ul>
            <li>
                <a class="btn" href="/">home</a>
                <a class="btn" href="chess">chess</a>
            </li>
        </ul>
    </nav>
    <div class="c2">
        <slot></slot>
    </div>
</div>


<style>
    .layout {
        display: grid;
        grid-template-columns: 250px 1fr;
        margin-top: 100px
    }

    .c2 {
        display: grid;
        grid-template-columns: auto 1fr;
        justify-self: center;
        gap: 50px;
    }

    nav {
        position: relative;
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
        font-size: 40px;
    }
</style>