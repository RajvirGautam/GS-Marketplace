import Icons from '../../assets/icons/Icons'

const Footer = () => (
  <footer className="border-t border-indigo-200 dark:border-white/10 bg-indigo-100/50 dark:bg-[#030014] pt-20 pb-10 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-600 to-violet-700 rounded-lg flex items-center justify-center text-white">
              <Icons.Zap />
            </div>
            <span className="text-2xl font-bold text-primary transition-colors duration-300">
              SGSITS.MARKET
            </span>
          </div>
          <p className="text-secondary max-w-sm font-medium">
            The next-generation marketplace for SGSITS Indore. Built by students, for students.
          </p>
        </div>
        
        <div>
          <h4 className="text-primary font-bold mb-6 transition-colors duration-300">Platform</h4>
          <ul className="space-y-4 text-secondary font-medium">
            <li>
              <a href="#" className="hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors">
                Browse All
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors">
                Sell Item
              </a>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-primary font-bold mb-6 transition-colors duration-300">Connect</h4>
          <ul className="space-y-4 text-secondary font-medium">
            <li>
              <a href="#" className="hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors">
                Club Contacts
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="pt-8 border-t border-indigo-200 dark:border-white/10 flex justify-between items-center transition-colors duration-300">
        <p className="text-secondary text-sm">
          © 2024 SGSITS Market. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
)

export default Footer