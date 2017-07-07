import {PAGE_INFO} from './mutation-types'

export default {
  [PAGE_INFO](state, {pageInfo}){
    state.pageInfo = pageInfo
  }
}
