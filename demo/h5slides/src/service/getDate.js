import XHR from './xhr'
let getPageInfo = (pid) => new Promise((resolve, reject) => {
  console.log('getdate');
  setTimeout(() => {
    resolve(pid + 'hello')
  }, 1000)
});

export {
  getPageInfo
}
