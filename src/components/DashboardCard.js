import './DashboardCard.css'

export default function DashboardCard({ width = 3, height = 1, children }) {
    return (
        <div
            className="dashboard-card"
            style={{
            gridColumn: `span ${width}`,
            gridRow: `span ${height}`,
            }}
        >
            <div className="card-inner">
            {children}
            </div>
        </div>
    )
}
