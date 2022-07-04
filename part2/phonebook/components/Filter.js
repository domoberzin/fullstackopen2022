import React from "react"

const Filter = ({filterName}) => 
    <form>
        <div>filter shown with: <input onChange = {filterName}/></div>
    </form>

export default Filter