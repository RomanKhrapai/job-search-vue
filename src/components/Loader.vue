<template>
    <div class="loader">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            style=" display: block; shape-rendering: auto;" width="200px" height="200px" viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid">
            <g transform="rotate(0 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.639344262295082s"
                        begin="-1.5027322404371584s" repeatCount="indefinite"></animate>
                </rect>
            </g>
            <g transform="rotate(30 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.639344262295082s"
                        begin="-1.366120218579235s" repeatCount="indefinite"></animate>
                </rect>
            </g>
            <g transform="rotate(60 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.639344262295082s"
                        begin="-1.2295081967213115s" repeatCount="indefinite"></animate>
                </rect>
            </g>
            <g transform="rotate(90 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.639344262295082s"
                        begin="-1.0928961748633879s" repeatCount="indefinite"></animate>
                </rect>
            </g>
            <g transform="rotate(120 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.639344262295082s"
                        begin="-0.9562841530054644s" repeatCount="indefinite"></animate>
                </rect>
            </g>
            <g transform="rotate(150 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.639344262295082s"
                        begin="-0.819672131147541s" repeatCount="indefinite"></animate>
                </rect>
            </g>
            <g transform="rotate(180 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.639344262295082s"
                        begin="-0.6830601092896175s" repeatCount="indefinite"></animate>
                </rect>
            </g>
            <g transform="rotate(210 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.639344262295082s"
                        begin="-0.5464480874316939s" repeatCount="indefinite"></animate>
                </rect>
            </g>
            <g transform="rotate(240 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.639344262295082s"
                        begin="-0.4098360655737705s" repeatCount="indefinite"></animate>
                </rect>
            </g>
            <g transform="rotate(270 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.639344262295082s"
                        begin="-0.27322404371584696s" repeatCount="indefinite"></animate>
                </rect>
            </g>
            <g transform="rotate(300 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.639344262295082s"
                        begin="-0.13661202185792348s" repeatCount="indefinite"></animate>
                </rect>
            </g>
            <g transform="rotate(330 50 50)">
                <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.639344262295082s" begin="0s"
                        repeatCount="indefinite"></animate>
                </rect>
            </g>
        </svg>
        Loading...
    </div>
</template>

    
<style scoped>
.loader {
    pointer-events: none;
    position: fixed;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 30px;
    justify-content: center;
    background: radial-gradient(ellipse at 50%, #ffffff, #33333300 75%);
    font-weight: bold;
    color: rgba(0, 140, 255, 0.867);
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 100;
}
</style>