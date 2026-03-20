import { JSX } from 'react'

interface Props {
    total: number
    active: number
    completed: number
    overdue: number
}

export default function StatsBar({ total, active, completed, overdue }: Props): JSX.Element {
    return (
        <div className="stats">
            <div className="stat"><span>{total}</span>Total</div>
            <div className="stat"><span>{active}</span>Active</div>
            <div className="stat"><span>{completed}</span>Done</div>
            {overdue > 0 && (
                <div className="stat overdue"><span>{overdue}</span>Overdue</div>
            )}
        </div>
    )
}