fetch ("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then(response => response.json())
    .then(data => {
        let index;
        let originate = () => {
            index = Math.floor(Math.random() * data.monthlyVariance.length);
            return index
        }
console.log(data.monthlyVariance[0])
        let click = () => {
            
            let div = document.getElementsByClassName("svg-container")[0];
            let p = document.createElement("p");
            data.monthlyVariance[0];
            p.innerHTML = JSON.stringify(data.monthlyVariance[0]);
            return div.appendChild(p)
        }

        document.getElementById("button").addEventListener("click", click)
        
        

    })