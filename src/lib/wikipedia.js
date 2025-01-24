export async function getRedirectURL(url) {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            redirect: 'manual'
        })

        if (response.status === 302 || response.status === 301) {
            return response.headers.get('location')
        }
        
        return undefined
    } catch (error) {
        return undefined
    }
}