import moment from "moment"

export const currencyFormat = (amount: number, fromZero = true): string => {
    const formater = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'COP',
        currencyDisplay: 'narrowSymbol',
        maximumFractionDigits: 0
    })
    
    return amount == 0 && fromZero ? 'N/A' : formater.format(amount)
}

export const ddmmyyyy = (date: string) => {
    return moment(date).format('DD-MM-YYYY')
}

export const fulldate = (date: string) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
}