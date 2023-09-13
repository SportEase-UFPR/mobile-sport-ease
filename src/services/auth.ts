// Serviço de autenticação de conta

export function SignIn() {
    // setando chamada fake com promise. INTEGRAR COM O BACK
    return new Promise(resolve => {
        
        setTimeout(() => {
            resolve({
                token: '123',
                user: {
                    name: 'admin',
                    email: 'admin@admin'
                }
            })
        }, 2000)
    }
    )
}

export function KeywordReset() {
    // setando chamada fake com promise. INTEGRAR COM O BACK
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                result: 200
            })
        }, 2000)
    }
    )
}