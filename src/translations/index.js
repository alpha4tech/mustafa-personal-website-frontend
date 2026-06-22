import common from './common.js'
import Sidebar from './Sidebar.js'
import ContactMessages from './ContactMessages.js'
import Users from './users.js'
import unauthorized from './unauthorized.js'
import Dashboard from './dashboard.js'
import HomeSection from './HomeSection.js'
import Blog from './blog.js'
import Portfolio from './portfolio.js'
import Services from './Services.js'

// دمج جميع الترجمات
const translations = {
  ar: {
    ...Blog.ar,
    ...Portfolio.ar,
    ...Services.ar,
    ...Portfolio.ar,
    ...common.ar,
    ...HomeSection.ar,
    ...unauthorized.ar,
    ...Dashboard.ar,
    ...Sidebar.ar,
    ...ContactMessages.ar,
    ...Users.ar,

  },
  en: {
    ...Blog.en,
    ...Portfolio.en,
    ...Services.en,
    ...common.en,
    ...HomeSection.en,
    ...unauthorized.en,
    ...Dashboard.en,
    ...Sidebar.en,
    ...ContactMessages.en,
    ...Users.en,

  }
}

export default translations
