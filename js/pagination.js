export default {
    props:['pages'],
    template: `
    <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" :class="{ disabled: !pages.has_pre }">
            <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true" @click="$emit('get-product',pages.current_page-1)">&laquo;</span>
            </a>
            </li>
            <li :class="{ active: page === pages.current_page }"
                class="page-item" v-for="page in pages.total_pages" :keys="'page_'+page">
                <a class="page-link" href="#" @click="$emit('get-product',page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: !pages.has_next }">
            <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true" @click="$emit('get-product',pages.current_page+1)">&raquo;</span>
            </a>
            </li>
        </ul>
    </nav>
`
}