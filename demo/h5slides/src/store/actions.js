import {PAGE_INFO} from './mutation-types'
import {getPageInfo} from '../service/getDate'
export default {
  get_page_info({commit, state}, {pid}){
    getPageInfo(pid).then(function (res) {
      console.log(res);
      commit(PAGE_INFO, {pageInfo: res})
    })
  }
}
