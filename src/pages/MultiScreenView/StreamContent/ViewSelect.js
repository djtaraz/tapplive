import { ReactComponent as TheatreView } from 'assets/svg/illustrations/multiscreen-page/theatre-view.svg'
import { ReactComponent as ListView } from 'assets/svg/illustrations/multiscreen-page/list-view.svg'
import { ReactComponent as GridView } from 'assets/svg/illustrations/multiscreen-page/grid-view.svg'

const IconContainer = ({ isSelected, Icon, onClick }) => (
    <div
        onClick={onClick}
        className={`mr-2.5 rounded-2.5 border ${
            isSelected ? 'border-violet-saturated' : 'border-transparent'
        } transition cursor-pointer`}>
        <Icon />
    </div>
)
const ViewSelect = ({ view, setView }) => (
    <section className="flex mb-3.5">
        <IconContainer Icon={TheatreView} isSelected={view === 0} onClick={() => setView(0)} />
        <IconContainer Icon={ListView} isSelected={view === 1} onClick={() => setView(1)} />
        <IconContainer Icon={GridView} isSelected={view === 2} onClick={() => setView(2)} />
    </section>
)

export default ViewSelect
