import React, { useState, useEffect, useMemo, useRef } from "react";

const APP_VERSION = "2026.07.30-200";
const LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALgAAABaCAIAAACE3QsZAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAABD/0lEQVR42u19d5hVRfJ2VXefcPO9k8ig5Bwkg0hSQMScV13Drrpm17jimnVdXcWcXXNCFFREBVSCoOSM5JxhmHjjOd1d3x/nzsxlABV1V35+e56RZ7zhTJ/u6gpvvVWNSilEBAAiQkTvXziU61A//2tdREREBxtP9VveQ3m/aK055w8//e+p0+cGQ5bSOvd7gAAE3n8AgDV/CDjAEw/dVa9OgVKSMf5Lhq1Jc8Y3bN1+69//KRER9E/5FuM8UZkc1K/XTVdfIpXkBx/DAefkh6cRSHNhlJRWTP9u7vKVqxxXBQP+7l069OnV1eRcSsUYCqUU5xwRvfn9rVb915KSnzJxW7bsXPT9qkjEr9QP3iErN0AABmPbdu/x22YwFPzFQwcAyGQyS1auUcARNfyE5+Ccl5VXtDiyCdRI8q92cWG8N3bC86+/v33XHtCaAADh3+982KF1y5E3XN6lfRsplfD2GWPs/4qIHFAUcgf/g2oGAMAwuW2ZPstWSv/YgmYvIcSfrv7bH8844cZrLpNScv4LlAoCAHBklm2DJvhp0845y9iWMA0A+JUWigBQay2EGPXC64899XIoGuNCOKkMY6hImba9YOmKi6+8+c0XRnVo00Jk9eH/KVk5mC6pZXQO9DoRedoINJH+qVqatFa7S+NpqX/Np9CHYCaQSOtDsCrVS3mQ7yAAaq2EEDPnLHzmpdfzigozKbdx/cIzThlWr07hqjUbx3w0gWMgHk88+MSLrz/zkKg1+/vLSu5+PRwkKXectcZ8QAcLEYlAa+VZKyGAMXaoSkATmhx8tvFrPsh/Zn4OaY2I4M3R4xC448rG9Qtff/bhenUKAODEIdCra4dLrxuJpj1v0dLFy5YLb3I9j4+I9leqh5Waqd4f+20UrHZdcj/gPR3nnLHslnBcmUym2CE+E6nMC6Pu6dfjKK3UL7I7h9FMaiFEaXnlytXr/D5/RTx5wTUn1atTkE5luOCIdHSvbqNffTKddgDgiEYNRS117dmgH1Djh5XFqRJiIkDPqGgiIELGRM5yVsQr16zftHjZqmUrVq1eu2nbjmKf/8c82X22PjLETu1bBwJ+pdRvuG8oa4Z+lVtpAL6reG95ZZwYWD7RqkVTIhIGZ4wBoFKqY9vWNV7aviqaiEhrXR0EHd5+CQFkx0wkAUgIwaui2tKyirUbNi1cumLR0hUr16zfsXN3Mu0wxk3LMA0LEQEOweFAJnYXlwQsMxAM/g7UCQIxIgDggjPGQGlSUjoyJ5KsPTnigFq9Gns4TGzQ/oPRRFprhphrCEor4ytXrVu0ZPnCpctXr9u8c3dxKuMgEz7Lsnx+fzBABJmMo7UjmNCHNK2MX3b9yHNPOv76q/70S6Oew2HXARAyAqhbkJcXje7YU+y6NGPO/D49j1JSSk1CMMb5Px57fk9JOZI+9/QR4oDeUK6TeECh+a38Eu05Uox5PwCQTqdXr9+8aOn3cxcuWbJi9fadezOOy7mwLMv0+QOBEABllBtPJt2M5II1rJvvKiivTAkG9JMdSiJYsXZbSWXy/57y2Hd71ywlMillKBDo0qnd2o+/CEei746d0OOoTgP69vDef2P0uOdfGc1MU4B7wbmnCSLynJJa0uApdMbYwaKh/5qUaNJEhACci+pwZf2mzQsWL5+zaPmS5au2bt2eSDjAmWUZAZ8dCgYBUEmZSacqMpKIImFfl3bNu3Vs37lju66d290/6vmPP/86Eg79VDcFUUl5wqDeA/p0/RnI9eFqfQABiOji80774suvHCkFw6v/dl//Pj0a1S9atW7zrHkLC+rllxSXnTjs2M7tWola+qO2hq/CV/7LE0QApLUmYojVcHV5PL58xZrZ8xbNnr94xdqNFRWVAGCZlmFZ0XybISgFjiPT8QqldMBnN25Qt3O7Vt2P6nhUxzZNmjQSVfcRHIn0oQgrINAj9/2tQd0iqTQ/5Oj6ML0YY0qpNs2b3nfbzbfe+6+UJJ/fP2nKt1JrLoRpWnt3lbZsVv/m6y5FUuKHUc79fZf/gnx4UTpWwR2btmybu3Dpt3MXLl6+auu2nemMNEzLtoxIJMqQAYCrVCKRdDIO47yoMNa3Zdve3bp07tSuebMm4UCw1v03b9m2Y1eJEOah2FNiiMlUUivFAOF3dDHGpJQnDx/UoF7hky+9uWjpSq0kQ2DaCZr2yacOu/bKi+oVFSrlioPfxNtzWdNTC6T6dYWGqEo+BEPGAEAquWrNhu/mLpr+7dzlK9eUllcQcsu0bNvnD3AEIgLXlal0Riod9Fstj2x0VPs2vXse1bVLh6L8vFqYlivV2nWbZs1bMPXbOUu+X51xlN/2a30I7iyBFqbFOJdKcuC/O1lxu3Xp8MazD69ev2n9xk1ak2mI9q1b1q1TCABKKmS8BkfZD/FEzAnYcyXj15KSbDROJDhHzgAgmU4vXrby29nzZ85ZtHrdxsp4khum3zbDkajnWJPWmUw6lU5rDYV5kW6dW/fq1rlP984tWzS3zdqwaTKdWbp81cxZ82fOX7R67caKeMo0Tds0BOdIkn7yIyBp5DxRvKtSOL7Chj8DGD184KgDmgvGuJQSEVs2bdKyaRNFmiMDAO9FZAgAolo+ch6GIZKHUtRaVKy6fuFwdbV9QWQAyXRm8dLvv5o2c8achRs2b0tmtG0atmXGYhHMIuiUSTvpTBoZq1eUN6Bv9wF9uvfq3qVxg3r7eBIIAFBaXrloybIpM2bPXrBk09ad6bS0bNOyzVDAn0omHSDb51OKEOgnwugEaAONvfuywcNP7HvpHUop9ntxU3L1CgClM86FV43cvn3bmNeeLCrIh5y1FrWUBBEhUk2K/deDEwFAayLSnDNvojOOs3Dx8i+nf/ft7AVrN23NONKyLMvy+3xIoBGQCDKOk0o7gkGj+nV7du/cv3fXrp07FBVkjYuULgEyQGRYUlo+debsGXMXLFz8/dbtxUopv9/2+XyGqZLJjKyobNigqPeQo0cMGfT2B59O+npmMBTSWv3EXZiRTlHLDo27DyQgRPjdXaiUNAxjxsxZ8xYudqQe89EX11x2gXIlcKwNuO27NRGAVcNzucSfQ00yE6CXfQUCzjkAB6Klq1ZP/HLa19/MXrdpeybjWJZl+/x+PxARAgOijCvTqYxg2KBeUY+uHYcOPLpb53bRSNi7p+M4QjDGhBCGUsrbECtWr79+5AOWz7ItfyQSkVIlk/F0OlWYHzum11Ejjuvfs2unvFgUAMZ9OlnTPob1xx6BNLJh1/6jUYM6SivPg/79yAiQBuQMtaa3xo4XnNv+wNgJk84/55RoKEhKAwMArAmPs5YFcg3OAbLVhwSraCKtlBDCC3G3bN3+5TezJn41fcmKtYlkyrJs27J9Pl/VzVFKlUrFgaBhgzo9u3Y8tn/vnkd1jEYi3l92MhkAMC3LNM1kKvXhhC+U61507imeIevetWPXTh1Wb9wqpYzH9xTmxXr363HcgD59e3atV6ewSsIyXBj6Z3gMiMrJENG+Bvn3cBEgac2FmL1w+ay5i21fAAXbuGXH+C+m/fGsEYoUAwOARG3PFLF6JmpJSa55qvZXfsAL8TY6EyKVycyYs2D8Z199N3fRnr2l3DQDli8vYmtS1fSZZCqtpCzICw/o03vY4IG9u3cuyIt5f1xKqbUWhmFaFgBs2rpj/BdfTpg4ZdmazQWx0PHH9q9TmOe6rm0avXt0WvT99wP6dBt8zNHH9Ol+RKMG3mCUVkTEkGVjqp9lVvEgqvSn7Jl9PkOHkzrxNAMjAHjng48zUhlaqbQjTPv9jz89+5ShhhCeGyD2c1CwGtGgKiN0QID/gL6IJtBac5b1QjZt3f7JpKmfT566au1GpZnf54tGo0SaaQkgCFk6k8mk0+GAr3fX9kMG9Rt4dM9G9etWyYerCADREgIAlNYz5y4cO2Hy9BmzdpWU+2xfYVF+vKx06oxvzz51hJcdPO/Mk44/bkCntq2y8qGkhiyFAkEjcmEYVebwkDUD1UCav1DV4690p1/nUloLzlet2TB1+neGwY9oVC8cDs1fvHzl6rWTp3034rhjXNflnIvqpPG+GqIqIqgKlHNVRTV/JXeveCIiODLOgejbOQve//iLb2bNLy4pty0rGAgiIihFmpDxDOlUZZwhNT+y4bBBxwwZeHS71i2q76+10oCCc4EMAIr3lnz25dSPv5iybMVax3H8gWBBXiGQSiUSZRXJqTPmnnXKCZwzAGhUv16j+vW01lprZIgISAoZ5yAAwM0ktq2Yu3nB1O3fL7Etm/RvvLXx8FAuSAQAb4/5JJ52M45z8vDBrVo2veDym0zL/+boscMG9fX2vDhI+t4TAi/HAvt7J7kui8dMEEIwzuPJxMSvv3v/k88WLlohXfIFrFg0QloTaURGjKdSmbSbKsqPHtev/4lD+/ft0dXn8wEAkdaaGGOAIITwttvi5avGffblpKnfbt++wzAtv+0LBEJKQ2VlpaucFkc2vPbP5588bGD1qDxnhTFkiEQauSEAtJvasWbZtoXTtiyauWvDGsokZbIx8Nghofj/ESmhmpD+t7o0EeN8687dE6fOFIZZpzB29qnDQwF/ty4dlny/bvGylTNnL+jfp7vrugJymCg5dse7CSCyXH2TKx+MMW/vGobBGCsuKflw/ORx4yet3rAJuRHw+xiQ1uAtv5KyMl7BGWvfqvkJQ44ZOrh/FQSipVTIsMpYEUMWT2UmT53x8YRJ8xYur0w5fp8VjcYYolKqvKKSSHVu2/ysU08Yftwx4WAoV2qrXCpgnAPw8uKtG76dvHH25NKNK5yKEs3tWKNm7QeMWDpl3ZJZS41gGLSE/78v0hqFeP+jCbuKywJ+OxYOvTN2giBl+/yc6YyL74yd0L9Pd1ZNEDwQVbZ2AUct8qyU0jAMzvmuPcWjP/p8zMdfbN6202f7wuEwEGmtiDHkIp1JpVOp/Fhk0NCBpxw/qF/vHobgAKCUIgDGEBiCJmQkCTji/CXLb7zjoU1bdzDGAj47LxJABEfqeDxhmaJvj07nnHr8cQOPNjgH0FI6yAQiA60IiFWll3evWbR62oRNc6dm9mxRUolQuEHPYU2PPv7Irv18oXxryb+kWsKQ1G+4QgCEvw5X7ef+fdREnPOSioqPJkz2W5ZpiI1bdz846kUA8vl8lmVzg6bPnL14xdpObZr/QFLwoDpREpkcGTN27y19e8wnYz+etGXnLtvvi0WjWmulNOMM0EwmElKVNz+yyUnDBo8Y2v/Ixo2qfEyFyBhjRIq0EtyErC4hRKpTWJBKpkN+nzAMDZRxZTyRDgesk4cdc85pJ/bu1gkAiJSUkjHGuCAi0i7nBgA4mcSGeV+vm/bpnhWLZaKMkWNG69TvNrhN/+F12/dCYEpr0gqkC8gOr/Djt1EnCoUx/rOvt2zbnReLJioTCrXtEwCglZNMZPyhcLJSvffBx53uuFEcLDeRS1KpVi2eJ2tynkyl3xv32avvjt2yZbs/EIrEIlpLr5ZMKV1RETe4OKpT6zNOHnL8oH7BQAAAtLfpmeCcayKtFecCAFav3zR3/uKzTjvRYKiUbFivzgVnn/zIs6/6g+F4ZUXdgujpwwace8aJbVu18LwQRRqZ4IyIFCFwJgB45Z4ta76buGnKhNLtG0FlgMgqqNe4+8C2Q84qaNLamxSlXQJEIeD3iK0eqo+kgTjnZRXx198dh4ztLt77lwvPGjaor6MUAhqcLV+z4d6HnuHCGD9xyh/OPKk2hL9fvWCWlwqIWinDMABgwuRpz7767rIVawM+XzRWSDoNUgrGXVBl5RVBnzV80NHnnD68b88uDDkASOUwxhljBEgEWkkuBHCxcfO2N94b+/EXU3fu3lOvft1BfXsoYIz02ace/8Z7Hxqmddkfzj/9xKGNGtQDAKk1EQmGAjlpB5mBTADAjpVzVk6bsHP+zHTZDmQIWvvz6jQ55qS2g0+L1GviBclZEIRxTQT/u6pXnPGVazYwTu1bNTMt+4o//SEvi20CAHTt3HHe/MVrNm5xXLlk8VLxw6gRIvMAMQZgGMaa9ZseeeaVyVO/NQzTC2e0SjMupFLlFeWRYPD0EcdeePbJHdt57G1SSjHGBTc9iVNKccaYELv27H3t3bGjP/qipLQ8HAoFgpGnX3r9mF7dDMYAqDA/77lH721Qv37dwjwAUEojEgcEZKQ0cGTclDKzbd7Xy776eNfyeUylkXNGYMTqHtnv+PbHnRUqbAQAWklArCkVRmDVzvh/IBP7f+viiKR1zy4dvhz7BgEQAUPw8iHe/HDEJ/95h1QkONsHmc2FUqg6lEAkJYVhSKlefuO9518bU1oej4TDRFopxRkCYGlFPOS3zj11+AVnndK2VTPPCwFEzlg1CVlrIiDBeTqTeWvMJ6+9O3bz9l2hYDgSjZLSIdtYtHTNW2M+vuicU5XSjOmundpnvRnGGEckrbRGZjDBM5nEhhmfr/pq7J61S00GlskzLvnzCpoNOqX1oDNC+fUIwFWSA+C+ldz4P69kH4UCiFhSWvbhZ5NOGja4bkGeVJIzkQOYKUaoCN59f1y/Xt3EQWDmLGZPWhqGtWr9prsfenLm7EWhUCgWCrhKMmSc8cpEQgh+ytCjL7/wHM+HUMpBEIzx3JupbNEUTpkx+7FnX1m8Yq3f78+LxbRSWrmMcUmUcdLLli3T+mRERGRaS0RPzoi0VMzgHFw3sWbmpOWfvl22cbkljIDfn0pVghlre/xp7YecG8yvAwCOymS/SP9zRH5EUBhjO/fsueuBxyd9Oe3lpx6OBH3VVV1eVguR3/3PUS+9/u67Lz8hcr3X6qIeQNBKC86QWe+N+/zhp14qq0zmx2JaSalJcJFMZ1wn069316suOa/HUR0AQEkFiMhNJF3DZSFQWnPOd+7eO+rZV8Z+9iWgyI9GlZZKKgIUXCTTSQEw8vrLL/3jWYBZhJsxBsCU1oiaMQO1WvPt50s/e3vvmqWWQF84mkonmaOaDTy78ykXRuoeURVMoYFmLZzwP5ol+T+cM/bUK7J69RrOW7zqljsffPqRewxEIgXIPAT1/keefffDCXXqNeRCiH1qMrJPj1q6hmkm084Djzz27oef+wKBcNAnlcuY0JrKy8pbNGt07Z8vOGnYQK+kDAAYZ1WqKDeVSJyzz76c/uBjz23eURINBwDAVQqBEBljvLy8rFmT+veO/Guf7l089DYbgQMxlebcBmCbFs1cOO7FkhVzDWChYEQqJ1GxN7/VUd3/8NeG7Xp6oZBX4JNNXv4Hkij4+xGR6oyTzgKebjoSi02e+u3t9z780N1/IwVEShjG0y+/9dKbH0Tz8510Egj2SQp6KJuUyjStrTt23/D3B2fPXxKL5WktSWvBeUW80m+bV/353L/88axwKKS0AoIDppGz5XtK3f/Y02+995lli1g0oKq6ATBuuFKmKstOOf64v990VX4sopTDmFENF3JE5HbxppWLP3h205xpDLQvEATkyXiZHQx3P+9v7U84l5s+raRCZlTxzf6DNMQq+cffY2itpRuJ5Y/+aHJeLP+26y8DgLfHfPr4c29EY3mkpOeHiFoPL6U0TfP71euvuOmuLduL82J5UmUYE0pjWVlp726dRl7/l47tWgOQ67qCC2D755ar3ButBecB26dJ+n0Bx5XeZAsh4vGEzzbuve3688882YtgOTe9VdVEjDHlpBZ+/O8Vn74pE3ErEOSMSyedcSrrdx3c6/zrYw2bE2lSLiI3EOD3RxL5r7orHBC0cmJ5+c+9Orpe3fz8/II7H3w8EAoRSc88AVAuMotSScs0Fy9bdfmNt+8tS0VCQSUzQojKRDJgmyOvv+yS8882OHNdFxn3PM1aK5QtG0OQSiNyIHXrtZfu3L173ISpsWhUa0kMSkpLu7Rvde/Iv3Zs00JrCYiMCwBSWjHGGLLt38+Z/dYTJavmmf6QFQog6Ew8zqN1el/8t7bHngmAWknGGHBDA+F/W0R+Z0LpzZ8mQqWcaDT88JOvMs79wSARESnGBBCCx0fJQnXatUxr2ar1l99we2lFyu/3K+WgMEvKyo7q0OKe227o2KYFKSlltpVX1mbtq8MAEBkrq4xHQ0HppCUzuFL33nbDxk07lq5eb1lWprLy4nNPvvmaywM+S0mXCQPAc501Z8JJVS4Y88KKie+idPyhGBCB1MlEut5RffteckukfnOtFYInWAAAh1RlcxhW3h8mloeADGEyVMmkY1umBiWl5pwLYUkpvb3BqoNmIcTWnbuvvPmu4vKU7fNpLYFhRXnp2acNe+uFxzq2aSEdhxByW93lUg6ItNYakT367CunX/CXNRu2CNPWWimlQwH70ftviwYtvwmPPfD3u2+5NuAzlZJccABAUkoTZ2Lnyrnj77542Uf/tjg3bVsDkJNIat3p3CuGjXwuUr+5Vooxjr8VA/73C8JoQCB9163XNWpQJ55Ku4r5LHHHLVeHAn6ltJfxYF6rKkTMuHTL3Q9t2bYn5PeTlkA6UVlx49WXPHzHTQHbkFJyIQAY7EtD92IlItKaODceffbfT738zqbtZRdddcu8xctt0wQi15FNmzR44dH7X3/2XycOHSCl1AScCwJGJAmQM754wpufP3BF5aZVvkhIowKGTqKc8hsee+tT3c68Er0MFudZx5QA6Kd6qb9OiQn+nhNEDFkmk+7cruVzj9wZC/vdVPyJf9w+fGCfTCpRDVoKAEbkGIb15DOvfTNrYUFennZdYpjOJO6+9boLzjrZqwJijOVwAWsyQR6ZXZMUwnz9vY+eePHtWDSKiMWl8cuuu23UP/4+oE8P5bquq7t2bgcArusKIQg8fpnL0ACtZrz64IrP3vb5Qmj5QCnkIlFZVr/9McdcdU+osL5WinHm/VGqghT/ayVV1Xju71ehIBIyxioqK9u3bvnMI/eW7C3u27Pr1h07gTEghaAANAMtDcOct3j5S2+OjkajSkrgLF5ROfL6qy4462TXdRDZwcLO7JopKbg5e8Gyfz7xfDgcJSKlHNs2Uw5dd+u94yZ8CYwhauk4rusyxkgTIYJ2EQ03HZ/82K0rJ7zmD4Q4OkQAKBKVlS0Hnzl05FOhwvpKuozzXL53NfDzP4fjV9kGnHPuZVuEqYm6d2o7dNAxWmsmBBOcC8E5RwSBDF1Fjz/3akaRBQCcl5WVX3nJORefe4rrZBgXB1uOrC7RmjFWVpm488HHpWYmQ601gNBS2T67tLTirffHDx8ygDFAxlg2kUQoFQrTSZZ/OeqmbQtnBkP5oBzFDATKJCs7nXFVz3OuJtBKe+mk/0W//6lLSlVaVkqIpKSULkOUbgYAhWFqpcrLyuIJh7TrOK7gQkyfOfe7uUtCoRCgqqxMDe7X66ar/6yUw7jxw5sWPUER4uU33l+5dkNeLCal63UoQq4yqXRhfugfd91gGVy6ijHm5Q9AK8ZFJl42adQ1uxfPC4XCUksBTAPqZLLbJXd2PP5crSUiMOQSQfxPSv4j9oYBQL26RfeMvN7rQVO3ME8rRcgRUWsV9Ptuu/FqkppItW7ZTADAmHETFAEydBzKi4buvPVqBqAIkR0gu5HLrvU6hq/ftOWdMR8HQ0Els5AaoiZEx8n8675bWjVt4jgO55xAIzGNxLjIJONfPvLX4qXz/eGIlooDEeMqFe968S0djz9XaYej4XmP4jeHo3LQBqhqafz7wE+IqDAvduFZJ+3j2Fb9Eg2HLzh9RPXrYsPm7fMWLQv4TSBIxhN/vfzSJg3qeqUc4PWu2rcMLJdC6/XSfO2dsSXlFZFYnpZZrjLnvKSs/OpL/3DC4H6ZTEYIAQAEDIE0EdOZqc/dvXPpDDtSCG6KkCMTqYp4h1P/2HH4hUo5DP9HQvvvmR5EmvDltI8/mxwOh0gDACKg0rpRg3pnjDjuyCMaOY4jhBBz5i8qqUiG/HYqk27etME5p55IWmY7iALp/VasuhWgUkoYYsv23V98PdMfDFBVHodzVpGo7Nu147WXnp/bFw+BiLQpjMWfvL5h1oRIKJ9cR6FAxtKpRJ3Ofbqed4NWLrL/sVn/uwA+F+s2bBk3YVp+LKK0JmAAwBhKKd/98NMnHhzZr1c3pRRbumKdJs24SKXSJwwZGAr6vQ7xVTHNAeMdXUVIYF9Om7l7b6nFTQLteS1SqYDP/vvNV1mGkUvlJ1IoROXe7cs+fTNo+0lLQmLEtJLcH+xz0c2cGQQAIA5DbfL7llzbNCORcDgSDgT9AZv5fUJwikaC8aQz8t5Hi0vKGGNsx86dnIFUKui3B/Tt7dmIHG/1ABB4VZ0V00TTZ86uzu8DAOM8Xpk446RhbVs1dTIOYzV2ijQwxFVfjk0X7xDCzPLnOGXSiRb9Tspr3FJLxbmBQPD7amn0fwHDJyKdSCZaNWv0zouPvfviqKf/eWfIb/hsc/O2XV9Pm4mIzMM2HMdpWL9uy+ZNiMjrsJPLU6kuUq+WEiISgu/es3fluk2mlVUnAKC0Dvisk4YOpGwRHFVrIWYYmWT5hlkThW2rbJUeaq0MX7TlwFNpX7t2WCvrquv3FQShVjocCnds16pj25bHDehz3MBj4skUF2LZyrUA4IFpzHXdRg3qBXy2Uir3nI9aDVE8jhIiaE2IbPv2XaXlcS6q2jYxzDhOw/p1mx5xBJDGbHo5O7kccefyOWU7txqGDaS8zysnE6nfNNa4KSlFSL9tq9L/XZiT5JWuRgAE7b0mIpEQAWgNRYUxACANXEAuElrdcFYplQ2MEb2V3llc5mbSlml43DiOQFrVr1sUCthec8HcLuQAsG35AuakmGm4VdlIIm34fJxbSjqAHHKa8R92XgodBmPIaV/1q6tJznlpZdnshUs40PbdJZOmfhMM+EvLSju0bgkAomWzI76Y8i0BeDU7B7xFrpRUs/MBAEghQ8aZq0FpKRVWlmd8tokIXovY6qaS3qOly0oF1kw4ETFuVu7dlaksMYMxncN4OuwQegJNWmmvmiAHLTh0/ZdlJf/c5VRer4ZfPDe4b6dPrcmyrFVrt1x89W0IpJS2bH9l2mnSoGhw/z5EJI7q1M42jYyTlq5bIwH7Wi9PSmomp4rc2qBeXek6leVllmUFA/6CWLR108Zdu3SseqpsyXsV7Q1QiH3K94m4MBN7tpVsWlWvfW+tJGcIP9gg+Te8ggE/Z1lm8C+5+IH6hP9EKTGE4Ixxk/1aWmTfhQbQKp3OeHFLqqysKD/8wJ035cciUkrRuX3bIxrWm79s7e49e6GqISTu57vVEh7GUGvVomnjh+66JRYNFxXkFxTkh4LBYMjPAaTrImPgNV7MqWSu06zVuikEiNUcbEQOTtmONcvqte8NWhGK7PmP3pkIh4cN8tqVzZy9sEGdAqV/UbM/RHRd2al9ayHEIaG8npTs2rP3u7kLldSw/4FDtcqWqvtSYM6/NTtfh4L+Tu1b5eC0KKUqyI/1OKqjJk2amjRqcNoJxzZqUE8qyRgTfp81ZEDf2YtWbt6+uzKRDAZ8SpGnBqpjnAOmCbQm0xRnnzo8V6k6GYdbpjAM13UQOaD2xoiIStERfYYu/ux9d+9mZlhAymv0yw1725yvO4w4v6a1QtVz5srKb6tmNODt94+ibA9jtk+ach9bvN+a4T6JAMZYZWXl6Fcea3pEY9DaM88/zWCR3++bt2jZhVct+IWwDmMskUx3bt9y3JvPecNjqAVnTsZt0fSIf919877QraxppHPKiCFvvP/x+k1bl61a26tLB9Daaw/sAWs/LObpTAY9IdVkGsK2zLWbtpaVVXbr1Np1JDBepT1QKemPFHU99y/TR90UNGyVLfyRhu3ftXbJ6knvtTvhYulmkAmqykTAfkXRv6FasWzfL89jM8akUj+vmz4RcC6EIQDYLxsDEnDbshABSAOAq7XjugSQzqSV0kpJz7Cwqq41AMCUlA3r1znnjBOL9xZ/OXWmV/3l7WaldK3OSrBfuxThNRVmzGdb8WTqhTfGnH3xtTf+/YGyyhRjqElXbypkoBzZss/xrUdcWFlR4UH7BIBKGz5r/pgX925cIQyLtKaaGmE4TBALBCKtvOMiifQv+1Hws04aRSAATZpI61/4o8kjjmUnNuiz6xaG6xSEYiGfRwOhLCukZpQMGdNa//n8M7t16fTBuAk7d+3hnEutdLbgr7aJ3c8PIiE4Ab7/8RdnXXzdg489n5Gwefuex555iQsOWhEhAQMkBqgYuor6XPDXZgNPrSgrYQy9rrImMkompzx/v5MsZ4yjVp61wizJUv/mskI1QTIB4S/7YTnuAx76GKrj5F/4AwDIuSDSfzj9pC/GvDZxzKtPPHQ359y0DMMQnHOtJVV1G2KIqEmHg/5/3XVzaXnF4y+9iYjadb1ivlwRqa5K3bdBFy/eW37epX+95d5HNm7bGY1GGVIoFHj7g/FvjhlvWabWDpACYAScgQfV8QFX3dNm+B/jFUkNmgS5BKbfLl+74NsX72fca4VMuS3BDgNZ2YcA+otX6JeP4Zd659W/S2KWZRXEoj7bN2fR8tEfffbWmPFffP3N1h07hDA5N6i6AIwhc13ZuX2rh+67/caR9wwdePTAvj3SyQQ3LE8wfgDVUNoNh4OR/BgyFvT7HccFBASy/OH7H30Ggc4/8ySllNf/AkAjImlCxH6X3hGuU2/B6OdERpq27ZIMBALrpn9uRmN9LrpNUVV/wH3bx/0PtP3VVSVq6bVxe/ntcRs3b9VSeWUwsWhwyMCjb7ziory8mFIqqzM4R0fKc08eOvL6K6//271bduy2/X6t1A/YUq/tABGzTfHPv9/UokmD8spKbjAvSOCoDdO+659PPvDY847Spmlo5WqlkYAYV4TaTXc66c9D/vakaNg0ES/zWnL4wv4V49+e8dL9jBMXBtX0qj9cbNDv7PKK0R988sUb7nx4y7Zdts/HDAMFWrYv48Iboz++4Iqbd+wuYdUn1yIyhug4ztWXnn/h+WdedtWtpRUJyzJJa0QkBIIDHuVNDNFxZX409NRD99QpiMYTSSEEodeYhQVD0ZfeGPOHS2/4ZtYC07JMy9RICIQIhEK6boMOfU+956U2J12kyIgnEqhVMBhaMem9if+6NlmyUxim1hJIIREwjfj7TMj9FjkdQkBXEeP8o8+/evbf7xUVFDAErahH5w4D+/QoKogmk4k6RUVLVq6/66HHtSZ+1113ZRU7EQAqpY/ueVRGq5df/7D/0d0DPlvVRPv7hKnVzEjvFKk6hXl9eh717bfzt+/eE/D5KRtda78/sG3H7k8nfrV67YaG9esXFeYxLb2EkceRM+xQ485HN+rcJ5NJ7tm0Rsu0Lxip2Lhq7bzpsXoNYw2aaWRaKY4AwCnbAPdnAvyeIZv49YyVazbatvnfFzhEdBz3tBHHRqPhN0eP/01MKSJK6RYW5p996vHSdW+/f1RZPE1AeZHAs/+685pLzz9x2MCThg3avWf3wuWrY9HYug3rO7dvy6phUA9EZYxlMvJP555+4Vkj3np/XGU86RVY5PAFDuA0MMYyGadN86ZvvfjwkH69ykpKXSfDOWeISjk+v2XY9ieTvznnz9etWLMRhSkVAYBhGIgonUzacfKPbDv42oeOu+mxcJM2ifK9YAhn7/avH7l+9tuPy1Q5NwzSSCSRDqOY+WdnF+m3pt4SoNZaMLZ+89a1m7b7LCuZTN541Z97dOnouo4r3bxo+N6Rfz2iUV3HyUjNps78bv+8A3HOnLTq36/nGSOOL6+Ie92ka0XI+68TF9zJOPWKip5//N7777qhqCBSVlqWyijGTAZcEAb9gbxYpDAvBoScoVZqb2m5dxSCbZrSlelMunHXgSPueb3PXx4INmmngclMetGYZ8bfefHWhdOZEJwbBIcXvvJ/2Y0lANi8fWc642glC/PyenTtoLXXcVO4jhPw2d07tkmlUpyx7du3i1xWvdf6BgCZQMeRdesWAoCUymvG9CMLQ8Q4c6SLAOeddsKwAX3HfPzF+C++XrV+o5TaHwgmU+njB/euU5iXSUvLFlu27brk6ltbNjvimN5HdevSsUXTxgJsADBsf9vjzmg18OTtKxdumffV7pXzdm1c99Fdf2px9AldzryszpGttdYEiIBAQED/i4N+FiqUjbRdRxJpAjRNwzBE9oAJIg8ZF4ahs+grEwc8Md3zPFy3BkM8mCKpDQ8jAkAmnc6PRf5y8Tl/PPuUWfMWTZnx3dyFy1auXt+3V3cAIK0AxLp169eu37x+0/ZPv/wmGgq0bHpEty7t+vXq2qZl03DQJ7ho1L5Ho/Y93HTF3s1r9q5fvHHZ4qkv3ndk7yFdR1wEpL1u197z/E9WDh1H0d65VvWLCk1DCM727Nm9cfP2wrw8V6YZ45wxRFy7fpMlTFIYjUTEfkjr/jgs7W90fpiwyAzDUYoU2ZY16Jheg47plUim1qzd2KRJI63ASyTtLSnNz4+GQgHU4Eq5a0/x9G/nf7989TG9up54/OA6dQulkwJk3ArVbdm1bsuu7YaByiQrKyuJFEPm9d+q6YJ/KLLCGPPqKP/7S8QY4zwLjXPOgQH+18sgvcf3mn43bdKgqCC/uKRMM/HUS28++/DdwYDP+9hbH05YsHR1MOiPxxM9u3cW+0F11QaoJvNZSyRqnQaWKzdYdZgoADDOtSZXKgDy2Xbnjm20Jq2Ic66UPHHowAFH9ybwqC3ks6xQMFAF4ikiAm4DAGiSWhEoBMZMf7Sg9jG0BwPiDqxpiAAglUyVVZQjaK/e4FfU5j9lkSorK6UrlVZl5RWMccADceeyTjsc9K77fwtzc9f4w0nBZCqdTCYzrhuJhE8aNmjUs68U1W84a+6i8y7964hhg2PRyMzZ8yZOmen3BxLxRLMj6g/q3+cAgrLvs++TkiDSB29dvG9DvGzLM/A2rlIkpUJkVb3iwDTNIp9vH5C3ih5VdWCdzg6CIXoVg6S0hn2ZTzV0iFox84HHyRAAundpp0n7/f5fs5E1HQgf3+8DiJhOp4ry8/yW75Tj+zNkVJUn2Ye5UEO1oFrkx6pVQdiPzkA5WxtqEVFynhQZZjLuEY3qcIZaq8suPHv+wkXTZi8pLChcvWnHg4+/BEic8WAoEE9mOMO/33hNLBRA13UPlLYmgCoaPeWmGPTBTFUtw/RjiQn9Y6J2AOvmvYI/Ahbjj62mRjgM+FCHQeG91pIIOOdl5ZV3P/zUhEnTXa2FMACRlFJStmjW5O6brujbq5uS7s8UFACkbP1hjdGpRaT6wVy6zhGNn0oY3u88uwNI1Q/LiicomjSRd7IS1l63ml1J2Ypj2m/D1lYS+2qUAyp+qtnoDJAhQ9SktT6QyFKWUZBVLVjr7ofgsdYgCQd8GzlHAq1JCA4Asxcunjp9ztqNm5XShfmxnkd1GDqoXyDgd6XkjHuCctCFqc7gHjDzSaQRgYChBo0agOeqvyy1rfr/EBEVEULWpjBvGhiQrurcxBjivpy+XL3i8f8RmVSSIQPYL1PoeVfIGMPc8xCzFUmgvHIERKB9G3wprZGA8ewhvlprIGCMV7E2NSASoSbFKLf3kneMokZEhkiwP8GKiDyzmG2xDODRfPbt7V0tpdWHklX1MCQg8I60Y4zhPpgdHND2VP3u4aCgvYZaBzrkDRGQewUZmkADGJzvr3Ncb6ygUUqZ5ZJhjZ+0bzDMDmSHKdf2YfZ8tx9WdKC15PyHKkaVdAgQUOx/zLmHBmccKRUFfBaR3l8JYdVkai1ZTlt3IuWd/pDzWQkgsse1aapuTJdKp2zbxmxIpTx6xU/ReVV0pBrKFSIqrTnLTmDGdZ2MY1mWaWQHVovqhqC9gpWDTk42A/+T4ACliYGudRpA7TErBYgSkWmHcY4gNIBOJ0gr4Qt5f8VVDkcOgDUaJVdQanmAB1fkGoAjgCMz9/3rue279hiGyKoSb+96ngrDTCp+zWUXdevcdtqMOS+99X4gGCSlvR1IpG3LaFi/fs/uXQb06YZEUmlE3F9QXKWvufmO71ete+HxB9u2bKqUymXUcs7XrN9030OPnXTi8DNGDFHZpnNZ4u26jRsfePR50zISyXS3Lh2uu/SP3pnx3mGYs+cv/GzS16vWby2rSISDgWaN6w4d3G/A0X2qu3wwhkuWLx/1zOuWz9ZUFdJqZRmsUcP6PXp0Hdi7e/bDVSdve1hUIpX6fPK06d/N3rB5eyKRCgQDRzaqP6B3t2HHDfD7fEpKxjkRMIYZx73roSd27tlrCUNX11UBFRXktWvZbNixx8SiEdd1DcNYtmLNw0//27YtItq/qbbjyKL8yF1/uzZgm+988Mmnk78JhUKejqxSNiydTnZq2/LGK/+kSWlNQohMunLtNxO2L5ldWbxDSemP5tVt1q5pv5NiDY709LeoFZEdwIP+YStIGhnTBLPnL12zcZNtW1p7iaOsFuCIwHiysuzc009ExG279kyc+l0sFlFSIsOs20ugXP3SG6OHDj76H3fcFAnYSu+zb5TWpmHMnDHny5nz04566/2xD95xcxWVv6aOpLSsYtqsJTMXrsikU+edcbLX6dS7Q1l5fNLUOf6AXVZWYQkDALRSyFARPvjIs6+/+5EmZZomF4aWet6i5e9+MvnU4YPuGXlD0LaUVoyJ4pKKL6bOCQZ9pL3wDSl7rIR88Y33hx93zD/uvDXos1ATIHrHVs2at+ieh55csXYzQzRMkwuudu1dtnLdJ19Me/ntD+689dpeR3XyzkMDIE3q2znz123a5bMM70QDTzlKrbVSL7zx3kN33tKzWycAKCmv+Gr6d8GA3ysz0lW6lSF6SbfGDYuU0gC4Yv3mL6Z8WxCLSqUZY57rwxirjCe8b2mlBDfLti2f8vh9e9ct4gYa3Eag+Fa5c8E3y754t/cfb2k56DQlXXYQCWA/FrZQlWOLnnVGBGAGAhNchILhUNAfDoVt2yQEZIgMPXdFGEY4GAwFguFQxDZ8DDgDzpgIx8LhSGTcZ1PvuH/U/i6ex/V994NPGLKivOgXX81Yt2kbF0IT5RopxjAUDvp9/rsefOKVdz4QgmutvHEKxoMhOxQMhkIhv8/2fAvG+HOvvvP8q+8Fw+FINF8TTyTSjpThcDgvGhs99vOHHn+eIXqV1YbgobA/FAyEQiHTNAkZQy64GYnGwpHIh59+fdeDT3hugSLNufh62ncXXX3b2s07YrFYJJrHueE6Lmc8GonF8sKrN+z401Ujp86c7TEOPa/BHwhEgsFQKOAP+AEZIAKyQCCQn5+/dWfJVbfevWbDpqxXxBgwRoxZlhUOB0LBQDgU4AYHBsgBWNaPsk0rHAyFgr5gMMC55+IxQIaIDLwTzHkmWT75iTv3blgaioQNO+RIJ5PJIAp/JMqk/OaFe7Ytnc35gR0LfQiRHAIBMmCd2jbPy4v4LaMikV6zfgsycF2nqCDSuH5dIpZOJ2KRiOfTePwjx3Hq1y1qUBRThNJ1lq9eLxGLigq/+Orbb+cu6Nezm1c9DwBKg2nw+Uu//2bOwoDtA2Cl5cnRH3068rrLSUvKqXAGAi2VsIQ/GL330eeV1peef5bjZkwmvHxp9QUAQhglZRXvj/00GosB6UQq1atr+w6tjty2e++Ub77LOBjOKxg3ftJF55za4sjGNTl20hnHbVS/qG5hniJQrly+aq1Go7Cw3qcTvz7rtOG9unTkRNt37Lr9H08AE0HbyjhuOp1s3KCoXp1mO3cVb9660/ZZkaAvnnJG3jtqzBtP1y/K80JLb2zSlT7b6tymmUbgyNZv3FpcWhEJR3YXF7/05vsP33lzJBDo3bWDz7IQaOuu4h279gohlNJtmjeNBO2M4xYVxlhNeZTUWmsF7Vs09fsMRcgYSyaTLVsc6TFZ18+aXLJuWSgacdOusv1HDDgxEIrtXLmoZO0y0/JxJ75o/Gv1OnT/0dZXPwwkZcEuQ5iPPnC7J1DLV28455LrkBvJivLBA46/469/0QQMwXEVQBZ/Y4wlEpWnn3TeFReeLbUUTDz/yuh/PfPvaNR0lJo5a0G/nt1yDqklAHxz9Ni0q20/I638fnvCxGl/+sOZRQVRpXV1cQx5HCvSiBgKRv7x6POupCsvOvuAGU1E3LFrT1l50jTtivKy884Ydt/IG7y3Xnpz9DMvvxmJhhJx2LZjV4sjm1R/SzAsSVSee/pFF59zugQtgD376tuPPv1GJBrNSDX9m3m9unRExDfe+2jrzuLCgrx0Jm0bePt1V50wZGA0Ei6vqPxs8rRHnn4t5bj+gLF1V/E7Yz6++eo/V3P5GLKM47Zq3uTN5x/xXlmxfvPFV9wUT6b8geC8xStSqWSXjm3HvPKk9+4T/35z1NOv5sXyHSd+19+u6dK2pfd6JpOpjhMJOJDz6AO3H9Gobu4MuK5jGGbptg0CERS53Bx89f2NuwwEADdVOemh68u2rvYVNHET8XQ68RN7pNF+rHGshR67rtJam6bhOm4NGqAUETmZDOci9zxqAgbIpeO6UmZSaZ/fN+S4Y55+9W1SEhmVlVVWAxRaa0OIVWs3Tpk+OxgIOq6rlfLZvq3bd3484cvLLjpLa68LrYdFepYISGuGEIrEHnnyhXQ6fcNfLkQgov0sGmlCQFAEMhIOVr9+6QVnn3vq8IzrKg2RQEBrt+bkD2AATEqpiaQjuWmcMGTwi6+NlsrhjK9ZvxEAEqn01zPnBvwWacqkUvfefOMZJw8DAK1VJBw89/QRhiFuuXeUYUZ8tj11xpxrL/+jZRgAsipwZZrAdV0AraRu07Rx+7atp3wzOxAIlJaUFpeUNmrgV8rVmoQwvO4T3uO7rktEUrrVDThrsBugNes3AClXuowxrVVRYX7IZ0NVxOF1TvMFot5jGr7Q8LteyFSWKymRGaZhih9LmuDBbVAtIJUhVuPo1ZS46r7RLNeieWUytt9nCGGEggDw/YpV6XTGCoWJ0LKtGvCaABBHj5tQFs+EA6wgEsrLz1+5Zp3PHxjzyefnnnFCwO/LKR2pcqIBFCFnEA5HHnv2FVPwAcf0rh1Ika5TVBAOB8orkqFw9JV3P1q5dlO7Vi0KCvIa1K/TsnnThnUKs2GprkEwNGTxEobIUCOiVK6rSBgMAZARAGzZvmPH7j2mZaRS6VYtm554/GCpJCJjyLQm0urk4ce9+u64NRu2+iyxdfuurdt3NGvSpApEQSBlMPJ6BhgGJFKpTVu2mabQSkcCvkAgCACIPDvbObs3O/nIGYLKJt2y3iQycfMd/wAURMAYj8fLn/jnyOHHDgSAcIMmWiHnQmZSkx+7vkHngeHCIn9e3VDdJvmNmwfC+QSAyhH7wWu/IGuP8GOBUjWmom3bnjVnIcqMQ5ROO+MmfCUMSyMiqA5tWlTLrjD4jl17Pv3ym1AoVFFWcs6pQwf273v+pddHYoVrNmz+ZNKU804b4bru/mPWWjoZx+/350Xznn7p3e8WLPL7zNzkjpRuXl7sjBHH/euplwuLCk3Tnv7dwq+/mQcIgkEoGOjQutn1V13SuV0brWQV4IEMNILMUi8YT2ecN98bl0qlo7ZfKdW6aRMASKVSWirDMl2ZrltUYJmGVrKmMRGiwXn9osKVazagz3IymVQ6Uz1rRGQIY2dJxbOvv8tIM8BZc5ds3LI7EPRXlpf36tImLxrRWtXu2PnjJCXUzEQgQECGwJgGAQBS6ebdj/v+iLfjm5bb4TydSK7/6gMgpZgQ3LSisYY9h/Y843Jhh8WvWQaBuXbqRyTFtu1vZi34avp3HpTiDwR8llFWVtaq2ZHHDeyrtWKMe0c5vP/JxJ27dxfEYqZlDx3Yr0vHtq1bNl+3cZtlB94fN+G0E46zDCM3D8wQU6lUl45tiwrzP/nsy7z8QhNhzvzvfZaZC2ghE1rrq/50XiKVGvPxpLKyMmScMcYZtyzLUXrKdwuXrxj5zstPNG/aKDdQDwYib4+ZMPHLGZpYIpnYuGlrKBhUUtqWPah/nywpB2tQtBycv+ZXomxbPQL0fskaTSBhGMV7Sh9+/CUPerYM2w5a0nGVdM8565QqQPynCkpV+lAl4mmlNSAwxisrKrTrAIBS0gzGBl/38LR/31+yZhmotAAAZtgMuEGqYs/SD59LlewafO194gfScgcJiNhBxSSroj2gfN/MTzZntI+Qm7Zt2RZnHBBIK8dxmjSs++CdN0VCAdeVyJgheGl55dhPJof9wXhl4uje3bt16QAAfzj7tDvufTSWF/z++zXTv507dODRjusaILAGEiWf3zfqvttIyY8nTcvPy/P7fForto8Aa8YM27LuvPGqyy44e9qs+WvWb0hUxnfs2LN01dpk2ikoyN+1a8/7H024/cYrcuwVcsF37SnfsasMQDLG7WBIKbVn966/XHhm5w5tASAcChqGkJpMU2zZsj2eTPhsWyvNOCOtECCZTm/cut00hNLKtsxIIAC5J9wRcC5C4QgC45xprbSSmuima/98bL+eWmvOWDUwX4vGeqA8jMcFpL9eeVHDOkUeSum4bsf2bYg055wh5B/R6rT73ixeOW/z9wtTpcXxREl8x+aKzWstbuTFCrbNm7Zr1WLxK1icg3gtPyTmyDSRKbjPxEQqIwkMLlLpTIf2bY7q0MZ10owbSmlhGp9OnLJ567ZoNKq03rFr119uulNrSiTTwYBfaVcz450Pxg8Z0FewfQbglZ4YAh594HZE+mTiN3mxfA16Hz8Joay8fMeuYuCMc3b2SUOr31qzYfMFV9xUmXRs27dq9TovasvdDUpJx3EIGZJMJpMBv33lxWfdev0VWitEbFivXuMGRSvXbQ36fes2b3vj/fFXXnROVn1wAQCvv/nB+o1bw9G8RDLevmXDBvXqAOTEbgCAGLCF0pRIOsIQWqPfNk85YSiR1kAIh9RhVWtEDXDy0AHeUeM1xldrRCjfscFNJpEJu7DeUad1yyoDrRZ99PKid58ygiFQ8eKN68VvwiPkHCrKyi+4+Nw/n3fa/GWr/jryPo0sFAp+PvGriYOPHjqoX9pxTC5S6cz7H31umKYmZdnWlm07127cgoScoc/nU9oN+APfzV0ya8GS3l071tpQHs/XYGzUA3eY5r8+/GRSNC8fQOV8wJg6c+6Ntz8QzS8oK6245A8n33TNny3T9GJLrQgBCah2jxaG6ZTTu1vHozq0TLtacMiLRrp37dK+ZTOvDlYpbRji+GP7L1r2Usgf9AX9T7/4VrIyfvrJQ+sUFOwu3vvh+EmvvDPWHwgyhEwqPXxwP84ZaVkj4plM62aNnx11HxHd9Pd/zF28MhQOl5SUPDzqmScfugu12j/J8sOmBwmAqLi0vKggz5WaMaaBOCNTCM7FlNce3bt4hmnZjrCHXHNfo879GAABSTfjFX0CAuNM/EQy7KGmtg+cNcq+QwCoiMKRUEF+3tD+vU8ePuTdD8bnxaJMWKOee71Xj64B22CcTZsye9mqdeFwSGsdr6jQ2fJlkoonMxVBv2GZhqvUm6PH9eraqXZ4RoDIlZac4cP33moI/u64L/ILCgBrOiW0atHMsm1H6kDQ//r7n85dtKLFEQ3KKhJzFy3NuK4/ECgvS3bu3D5HnRBjLJVKHtu/5wVnnrLPtpUKOWbPStX67NNP/mjCV+s3bg9FAi7wZ14d/c7YCQV5seLSspKyRCgQECZWVJS3bdn0zFNHaE3IBILyQhgiEIZRv04hAFx3xSUXX3WTVCoYDn/29benTJ816JheSskc8T0gp4HlIhHesG+440HTEF5S3XFl3fzI86Pui4TDRQ2b7Z77peU3MVXx9eO3FLTq4gtGy3ZuKN3wveWzUbnMCNRt0Ub8dOL0j7kpWXoHAXKWba1RpU6Z1yEFgAMiY8yDv73SQ6X0lZecN2XajMqkDIWCq9dveu2tD677yx+llG+NGW8IgYik9TmnDY9GI97pykDEOU7+asaO3SWRSGjG7AXfr1zbrnVzpYkjQ8Y4y3p7jHk0Af3gXTdbtv3Gex+hYQJnAOA4bpsWR5518rDn3/igqLBOIOBfsXb94u9XMMYDfr9t+3YXFzdv1ujs00d4njV4JAhmMM7SmbRXUM25AO9oXsGr/TytVV44+PC9t11+3W07i0sjkWheNOpItXnHHkMYebGwknrv3ooGdWKP3ndrNBxUSjHggMSQAeeIGhgqUqRVr64dTxgy6P1Pvy7MzxOG8+gz/+7ZvbPPqgnfGCJnxBjjrAq3xxrEC5FxZAw5R9i9u9Sj4SBixpVKKi9V0n7YOetnfV6xe6s/GOIqs3vRVNLa5EbA8istS8tLO596WUHTDiK3Br2ajvpj9kgfhMeJAECaKhNJQ8h4vCLjZGp9RkoZj8ctny9RGZduBhGdjNuoXuElfzz77n88GQwFkYknXnjt+GOP3rWn9KtvZkcioV27dw/p3/vBv/+11q0aNah3498fjEaje0tLX3lz9KMP3K6UrEwkLaUr44lUOu05QwhAoJVy77n1moDf9/BT/3bSaY+lqbT82w1XMGDvj5+cSKSFafj8Aa0pmUoxwD7dOt0/8vp6BXmudBnjUsp4PMG4lYgnVFW68YAMbca4Vm6nti3efvnxBx996tt5SysdLQTnnGWcdDKpfKYxtH+P2264vGmTxkoqr7EvEKaSiXgirrRKJdOInCER6asvv2jKjDklxSW2bc1euPzx5165/YYrq3P+juPGEwnTNFOpBCiVXb0q1rOTcRLxSssU3unh1YsrpaukRGRAEC6sN+zmJ2Y+f/eeTauEBkOYgCg1ptMZ0za7nHFVjz9crWVVI7/ckzN+bsBMRCg427mn5JNJUziyVMbt2K5Fvx5HKaURURMZnK1Yu37KN9/5bH8qle7ZrUPXTu1dV3FOibT7wccTXekKbsYTicH9e2qlv545PxSwk6lU/7492rc4wnGrVS4hsnjaGTd+otSklFuUFz1txNDtu/Z8MnGaIZjjygZ1i04a2l8TYLZIRXlHcr/1wfhYJHjCsf29w/I8JtS8JcsnfTV9+cp1e0vKgwFf86aN+/buNmTQMRZnOpsrhs1btn/+9TeWaSVT6aN7du7YrnUuN6r2RABorbxDMqfNnj9txtx169ftLS7OKyho2az5gL49ju7ZBQCU9GBlQATX1R9+OrGiMkmkC/Iip50wFJGUVpyLKdO/W7lmo+GzHdetV5B/yvCB3ioxxuYsXDZ30VLL9inpnDR0YL2iQkXECTVoxth3cxcuWLbKtm3KZaQjKqXCAfu0EUMt03C1MrmQ6fjaWZ9vXzq3dNtW6TrBaKToyNZNeh1f1Lw9aQLt/j8jVfzUgBrfUwAAAABJRU5ErkJggg==";

/* ---------- configuração da integração com Google Sheets ---------- */
const GOOGLE_CLIENT_ID = "916443066549-qj84og3gajuru9734bgjgd207rfs3l6e.apps.googleusercontent.com";
const SPREADSHEET_ID = "1-1H2_kpa624M7v7Sfs3e8F2488gjMrrJ1D898CTHa9U";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file";

const CAMINHOES_HEADER = ["id", "placa", "semAlertaOleo", "intervaloOleoKm", "tipo", "modelo", "foto", "renavam", "chassi", "anoFabricacao", "anoModelo", "cor", "combustivel", "categoria", "municipio", "uf", "vencimentoDocumento", "documentosPorAnoJSON", "crv", "ipvaPagoPorAnoJSON", "carretaVinculadaId"];
const VIAGENS_HEADER = [
  "id", "caminhaoId", "data", "origem", "destino", "kmInicio", "kmFim", "dataFim",
  "contrato", "adiantamento", "dataRecebAdiantamento", "saldoReceber", "dataPagamentoSaldo",
  "empresa", "motorista", "valorComissaoBase", "pedagio", "abastecimentosJSON", "gastosExtrasJSON",
  "carregamento", "comissaoFixa", "valorComissaoFixa", "comissaoJaPaga", "carregamentoMotorista",
];
const VALES_HEADER = ["id", "motorista", "data", "valor", "tipo", "observacao", "origemGastoId", "agendado"];
const BOLETOS_HEADER = ["id", "empresa", "descricao", "notaFiscal", "valor", "dataVencimento", "contaBancaria", "dataPagamento", "observacao", "desconto", "descontoDescricao", "juros", "baixasJSON", "codigoBarras", "linhaDigitavel", "novoVencimento"];
const EMPRESAS_HEADER = ["id", "nome", "categoria", "incluirRelatorio"];
const FECHAMENTOS_HEADER = ["id", "motorista", "data", "valor", "tripIdsJSON", "valeIdsJSON"];
const DESPESAS_VEICULO_HEADER = ["id", "caminhaoId", "data", "descricao", "valor", "observacao", "origemSeguroId"];
const TAXAS_POOL_HEADER = ["id", "mes", "data", "valor", "descricao"];
const MOTORISTAS_HEADER = ["id", "nome"];
const CONTAS_HEADER = ["id", "nome"];
const TROCAS_OLEO_HEADER = ["id", "caminhaoId", "data", "km", "filtroTrocado", "observacao"];
const SERVICOS_VEICULO_HEADER = ["id", "caminhaoId", "data", "km", "tipoServico", "observacao", "empresa"];
const SEM_PARAR_HEADER = ["id", "caminhaoId", "dataVencimento", "valorPedagio", "valePedagio", "credito", "observacao", "confirmado"];
const SEGURO_HEADER = ["id", "mes", "cavaloCaminhaoId", "cavaloValor", "carretaCaminhaoId", "carretaValor", "observacao", "boletoIdCavalo", "confirmado", "seguradoraCavalo", "seguradoraCarreta", "boletoIdCarreta"];
const SEM_PARAR_OUTROS_HEADER = ["id", "data", "valor", "observacao", "confirmado"];
const CONFIG_HEADER = ["chave", "valor"];

async function sheetsFetch(path, token, options = {}) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`Google Sheets (${res.status}): ${body}`);
    if (res.status === 403) err.isPermissionError = true;
    throw err;
  }
  // o pedido em si deu certo (res.ok) — se o corpo da resposta vier vazio ou
  // não for um JSON válido por algum motivo, isso não significa que a gravação
  // falhou, só que não conseguimos ler a confirmação. Não trava o salvamento
  // por causa disso.
  try {
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function ensureSheetsExist(token) {
  const meta = await sheetsFetch("?fields=sheets.properties.title", token);
  const titles = (meta.sheets || []).map((s) => s.properties.title);
  const missing = ["Caminhoes", "Viagens", "Vales", "Boletos", "Empresas", "Fechamentos", "DespesasVeiculo", "TaxasPool", "Motoristas", "Contas", "TrocasOleo", "ServicosVeiculo", "SemParar", "Seguro", "SemPararOutros", "Config"].filter((t) => !titles.includes(t));
  if (missing.length > 0) {
    await sheetsFetch(":batchUpdate", token, {
      method: "POST",
      body: JSON.stringify({
        requests: missing.map((title) => ({ addSheet: { properties: { title } } })),
      }),
    });
  }
  // garante a linha de cabeçalho em todas as abas
  await sheetsFetch(`/values/Caminhoes!A1:U1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Caminhoes!A1:U1", values: [CAMINHOES_HEADER] }),
  });
  await sheetsFetch(`/values/Viagens!A1:X1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Viagens!A1:X1", values: [VIAGENS_HEADER] }),
  });
  await sheetsFetch(`/values/Vales!A1:H1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Vales!A1:H1", values: [VALES_HEADER] }),
  });
  await sheetsFetch(`/values/Boletos!A1:P1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Boletos!A1:P1", values: [BOLETOS_HEADER] }),
  });
  await sheetsFetch(`/values/Empresas!A1:D1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Empresas!A1:D1", values: [EMPRESAS_HEADER] }),
  });
  await sheetsFetch(`/values/Fechamentos!A1:F1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Fechamentos!A1:F1", values: [FECHAMENTOS_HEADER] }),
  });
  await sheetsFetch(`/values/DespesasVeiculo!A1:G1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "DespesasVeiculo!A1:G1", values: [DESPESAS_VEICULO_HEADER] }),
  });
  await sheetsFetch(`/values/TaxasPool!A1:E1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "TaxasPool!A1:E1", values: [TAXAS_POOL_HEADER] }),
  });
  await sheetsFetch(`/values/Motoristas!A1:B1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Motoristas!A1:B1", values: [MOTORISTAS_HEADER] }),
  });
  await sheetsFetch(`/values/Contas!A1:B1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Contas!A1:B1", values: [CONTAS_HEADER] }),
  });
  await sheetsFetch(`/values/TrocasOleo!A1:F1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "TrocasOleo!A1:F1", values: [TROCAS_OLEO_HEADER] }),
  });
  await sheetsFetch(`/values/ServicosVeiculo!A1:G1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "ServicosVeiculo!A1:G1", values: [SERVICOS_VEICULO_HEADER] }),
  });
  await sheetsFetch(`/values/SemParar!A1:H1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "SemParar!A1:H1", values: [SEM_PARAR_HEADER] }),
  });
  await sheetsFetch(`/values/Seguro!A1:L1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Seguro!A1:L1", values: [SEGURO_HEADER] }),
  });
  await sheetsFetch(`/values/SemPararOutros!A1:E1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "SemPararOutros!A1:E1", values: [SEM_PARAR_OUTROS_HEADER] }),
  });
  await sheetsFetch(`/values/Config!A1:B1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Config!A1:B1", values: [CONFIG_HEADER] }),
  });
}

// corrige na hora um erro comum de digitação em campo de data: quando a
// pessoa digita só os 2 últimos dígitos do ano (ex: "26" em vez de "2026"),
// o campo nativo do navegador às vezes salva como "0026" — aqui a gente
// detecta isso e já completa pro ano de verdade (20XX), sem precisar a
// pessoa perceber e corrigir na mão depois
function corrigirAnoDigitado(valorISO) {
  if (!valorISO || typeof valorISO !== "string") return valorISO;
  const partes = valorISO.split("-");
  if (partes.length !== 3) return valorISO;
  const ano = Number(partes[0]);
  if (ano > 0 && ano < 1000) {
    const anoCorrigido = 2000 + (ano % 100);
    return `${anoCorrigido}-${partes[1]}-${partes[2]}`;
  }
  return valorISO;
}

function safeParseJSON(str, fallback) {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
}

function rowToTruck(row) {
  let documentosPorAno = {};
  try { documentosPorAno = JSON.parse(row[17]) || {}; } catch (e) { documentosPorAno = {}; }
  let ipvaPagoPorAno = {};
  try { ipvaPagoPorAno = JSON.parse(row[19]) || {}; } catch (e) { ipvaPagoPorAno = {}; }
  return {
    id: row[0] || "", placa: row[1] || "", semAlertaOleo: row[2] === "sim", intervaloOleoKm: row[3] || "",
    tipo: row[4] === "carreta" ? "carreta" : "cavalo", modelo: row[5] || "", foto: row[6] || "",
    renavam: row[7] || "", chassi: row[8] || "", anoFabricacao: row[9] || "", anoModelo: row[10] || "",
    cor: row[11] || "", combustivel: row[12] || "", categoria: row[13] || "", municipio: row[14] || "", uf: row[15] || "",
    vencimentoDocumento: row[16] || "", documentosPorAno, crv: row[18] || "", ipvaPagoPorAno,
    carretaVinculadaId: row[20] || "",
  };
}
function truckToRow(t) {
  return [
    t.id, t.placa, t.semAlertaOleo ? "sim" : "", t.intervaloOleoKm || "", t.tipo === "carreta" ? "carreta" : "cavalo",
    t.modelo || "", t.foto || "", t.renavam || "", t.chassi || "", t.anoFabricacao || "", t.anoModelo || "",
    t.cor || "", t.combustivel || "", t.categoria || "", t.municipio || "", t.uf || "", t.vencimentoDocumento || "",
    JSON.stringify(t.documentosPorAno || {}), t.crv || "", JSON.stringify(t.ipvaPagoPorAno || {}),
    t.carretaVinculadaId || "",
  ];
}
function rowToTrip(row) {
  return {
    id: row[0] || "",
    caminhaoId: row[1] || "",
    data: row[2] || "",
    origem: row[3] || "",
    destino: row[4] || "",
    kmInicio: row[5] || "",
    kmFim: row[6] || "",
    dataFim: row[7] || "",
    contrato: row[8] || "",
    adiantamento: row[9] || "",
    dataRecebAdiantamento: row[10] || "",
    saldoReceber: row[11] || "",
    dataPagamentoSaldo: row[12] || "",
    empresa: row[13] || "",
    motorista: row[14] || "",
    valorComissaoBase: row[15] || "",
    pedagio: row[16] || "",
    abastecimentos: safeParseJSON(row[17], []),
    gastosExtras: safeParseJSON(row[18], []),
    carregamento: row[19] || "",
    comissaoFixa: row[20] === "sim",
    valorComissaoFixa: row[21] || "",
    comissaoJaPaga: row[22] === "sim",
    carregamentoMotorista: row[23] || "",
  };
}
function tripToRow(t) {
  return [
    t.id, t.caminhaoId, t.data, t.origem, t.destino, t.kmInicio, t.kmFim, t.dataFim,
    t.contrato, t.adiantamento, t.dataRecebAdiantamento, t.saldoReceber, t.dataPagamentoSaldo,
    t.empresa, t.motorista, t.valorComissaoBase, t.pedagio,
    JSON.stringify(t.abastecimentos || []), JSON.stringify(t.gastosExtras || []),
    t.carregamento || "", t.comissaoFixa ? "sim" : "", t.valorComissaoFixa || "",
    t.comissaoJaPaga ? "sim" : "", t.carregamentoMotorista || "",
  ];
}

function rowToVale(row) {
  return {
    id: row[0] || "",
    motorista: row[1] || "",
    data: row[2] || "",
    valor: row[3] || "",
    tipo: row[4] || "vale",
    observacao: row[5] || "",
    origemGastoId: row[6] || "",
    agendado: row[7] || "",
  };
}
function valeToRow(v) {
  return [v.id, v.motorista, v.data, v.valor, v.tipo || "vale", v.observacao || "", v.origemGastoId || "", v.agendado || ""];
}

function rowToFechamento(row) {
  return {
    id: row[0] || "",
    motorista: row[1] || "",
    data: row[2] || "",
    valor: row[3] || "",
    tripIds: safeParseJSON(row[4], null),
    valeIds: safeParseJSON(row[5], null),
  };
}
function fechamentoToRow(f) {
  return [f.id, f.motorista, f.data, f.valor, JSON.stringify(f.tripIds || []), JSON.stringify(f.valeIds || [])];
}

function rowToDespesaVeiculo(row) {
  return {
    id: row[0] || "",
    caminhaoId: row[1] || "",
    data: row[2] || "",
    descricao: row[3] || "",
    valor: row[4] || "",
    observacao: row[5] || "",
    origemSeguroId: row[6] || "",
  };
}
function despesaVeiculoToRow(d) {
  return [d.id, d.caminhaoId, d.data, d.descricao, d.valor, d.observacao || "", d.origemSeguroId || ""];
}

function rowToTaxaPool(row) {
  return { id: row[0] || "", mes: row[1] || "", data: row[2] || "", valor: row[3] || "", descricao: row[4] || "" };
}
function taxaPoolToRow(t) {
  return [t.id, t.mes, t.data, t.valor, t.descricao || ""];
}

function rowToMotorista(row) {
  return { id: row[0] || "", nome: row[1] || "" };
}
function motoristaToRow(m) {
  return [m.id, m.nome];
}

function rowToConta(row) {
  return { id: row[0] || "", nome: row[1] || "" };
}
function contaToRow(c) {
  return [c.id, c.nome];
}

function rowToTrocaOleo(row) {
  return {
    id: row[0] || "",
    caminhaoId: row[1] || "",
    data: row[2] || "",
    km: row[3] || "",
    filtroTrocado: row[4] || "",
    observacao: row[5] || "",
  };
}
function trocaOleoToRow(t) {
  return [t.id, t.caminhaoId, t.data, t.km, t.filtroTrocado ? "sim" : "", t.observacao || ""];
}

function rowToServicoVeiculo(row) {
  return {
    id: row[0] || "",
    caminhaoId: row[1] || "",
    data: row[2] || "",
    km: row[3] || "",
    tipoServico: row[4] || "",
    observacao: row[5] || "",
    empresa: row[6] || "",
  };
}
function servicoVeiculoToRow(s) {
  return [s.id, s.caminhaoId, s.data, s.km, s.tipoServico, s.observacao || "", s.empresa || ""];
}

function rowToSemParar(row) {
  return {
    id: row[0] || "",
    caminhaoId: row[1] || "",
    dataVencimento: row[2] || "",
    valorPedagio: row[3] || "",
    valePedagio: row[4] || "",
    credito: row[5] || "",
    observacao: row[6] || "",
    confirmado: row[7] === "sim",
  };
}
function semPararToRow(s) {
  return [s.id, s.caminhaoId, s.dataVencimento, s.valorPedagio, s.valePedagio || "", s.credito || "", s.observacao || "", s.confirmado ? "sim" : ""];
}

function rowToSeguro(row) {
  return {
    id: row[0] || "",
    mes: row[1] || "",
    cavaloCaminhaoId: row[2] || "",
    cavaloValor: row[3] || "",
    carretaCaminhaoId: row[4] || "",
    carretaValor: row[5] || "",
    observacao: row[6] || "",
    boletoIdCavalo: row[7] || "",
    confirmado: row[8] === "sim",
    seguradoraCavalo: row[9] || "",
    seguradoraCarreta: row[10] || "",
    boletoIdCarreta: row[11] || "",
  };
}
function seguroToRow(s) {
  return [
    s.id, s.mes, s.cavaloCaminhaoId, s.cavaloValor, s.carretaCaminhaoId || "", s.carretaValor || "",
    s.observacao || "", s.boletoIdCavalo || "", s.confirmado ? "sim" : "", s.seguradoraCavalo || "",
    s.seguradoraCarreta || "", s.boletoIdCarreta || "",
  ];
}

function rowToSemPararOutro(row) {
  return { id: row[0] || "", data: row[1] || "", valor: row[2] || "", observacao: row[3] || "", confirmado: row[4] === "sim" };
}
function semPararOutroToRow(s) {
  return [s.id, s.data, s.valor, s.observacao || "", s.confirmado ? "sim" : ""];
}

function rowToConfig(row) {
  return { chave: row[0] || "", valor: row[1] || "" };
}
function configToRow(c) {
  return [c.chave, c.valor];
}

function rowToBoleto(row) {
  return {
    id: row[0] || "",
    empresa: row[1] || "",
    descricao: row[2] || "",
    notaFiscal: row[3] || "",
    valor: row[4] || "",
    dataVencimento: row[5] || "",
    contaBancaria: row[6] || "",
    dataPagamento: row[7] || "",
    observacao: row[8] || "",
    desconto: row[9] || "",
    descontoDescricao: row[10] || "",
    juros: row[11] || "",
    baixas: safeParseJSON(row[12], []),
    codigoBarras: row[13] || "",
    linhaDigitavel: row[14] || "",
    novoVencimento: row[15] || "",
  };
}
function boletoToRow(b) {
  return [b.id, b.empresa, b.descricao || "", b.notaFiscal, b.valor, b.dataVencimento, b.contaBancaria, b.dataPagamento, b.observacao || "", b.desconto || "", b.descontoDescricao || "", b.juros || "", JSON.stringify(b.baixas || []), b.codigoBarras || "", b.linhaDigitavel || "", b.novoVencimento || ""];
}

// ---------- cálculo financeiro de boletos (compartilhado por toda a tela de
// Boletos, Relatórios e Dashboard Geral, pra nunca ficar dessincronizado) ----------

// valor base do boleto já com desconto/juros aplicados, sem considerar baixas
function valorBaseBoleto(b) {
  return (Number(b.valor) || 0) - (Number(b.desconto) || 0) + (Number(b.juros) || 0);
}
// soma de todas as baixas parciais já registradas nesse boleto
function totalBaixasBoleto(b) {
  return (b.baixas || []).reduce((s, bx) => s + (Number(bx.valor) || 0), 0);
}
// quanto ainda falta pagar desse boleto, depois de descontar as baixas
function saldoRestanteBoleto(b) {
  return valorBaseBoleto(b) - totalBaixasBoleto(b);
}
// valor "final" de um boleto pra fins de relatório/estatística: se já foi
// quitado, é o que sobrou pra fechar (base − baixas); enquanto está em aberto,
// é a mesma coisa (o quanto ainda falta) — por isso os dois usos batem
function valorFinalBoleto(b) {
  return saldoRestanteBoleto(b);
}
// um boleto só é considerado REALMENTE quitado quando tem "Data de
// pagamento" preenchida E não sobra saldo pendente. Se tiver um "Novo
// vencimento" preenchido e ainda sobrar saldo, isso significa que a "Data de
// pagamento" ali é só a data de uma baixa/pagamento parcial (o saldo
// restante foi reagendado pro novo vencimento) — o boleto continua em
// aberto até esse saldo ser realmente zerado
function boletoEstaQuitado(b) {
  if (!b.dataPagamento) return false;
  if (b.novoVencimento && saldoRestanteBoleto(b) > 0.009) return false;
  return true;
}
// status textual (pendente/vencido/pago) de um boleto numa data de referência
function statusBoleto(b, hoje) {
  if (boletoEstaQuitado(b)) return "pago";
  const vencEfetivo = b.novoVencimento || b.dataVencimento;
  return vencEfetivo < hoje ? "vencido" : "pendente";
}
// lista de "eventos de pagamento" de um boleto: cada baixa conta como um
// pagamento na sua própria data, e — só quando o boleto está de fato
// quitado (ver boletoEstaQuitado) — o saldo final também conta como um
// evento, na data de pagamento. É isso que permite que cada baixa entre no
// mês certo no Dashboard Geral, mesmo que o boleto só feche de vez depois
function eventosPagamentoBoleto(b) {
  const eventos = (b.baixas || [])
    .filter((bx) => (Number(bx.valor) || 0) > 0 && bx.data)
    .map((bx) => ({ data: bx.data, valor: Number(bx.valor) || 0, tipo: "baixa", contaBancaria: bx.contaBancaria || "", observacao: bx.observacao || "" }));
  if (boletoEstaQuitado(b)) {
    const restante = saldoRestanteBoleto(b);
    if (restante > 0.009) eventos.push({ data: b.dataPagamento, valor: restante, tipo: "fechamento", contaBancaria: b.contaBancaria || "", observacao: "" });
  }
  return eventos;
}

function rowToEmpresa(row) {
  return { id: row[0] || "", nome: row[1] || "", categoria: row[2] || "", incluirRelatorio: row[3] !== "nao" };
}
function empresaToRow(e) {
  return [e.id, e.nome, e.categoria || "", e.incluirRelatorio === false ? "nao" : ""];
}

async function loadFromSheets(token) {
  try {
    await ensureSheetsExist(token);
  } catch (e) {
    // se falhar (ex: usuário só com permissão de leitura), segue em frente
    // e tenta ler os dados mesmo assim — as abas já devem existir.
  }
  const [caminhoesRes, viagensRes, valesRes, boletosRes, empresasRes, fechamentosRes, despesasVeiculoRes, taxasPoolRes, motoristasRes, contasRes, trocasOleoRes, servicosVeiculoRes, semPararRes, seguroRes, semPararOutrosRes, configRes] = await Promise.all([
    sheetsFetch(`/values/Caminhoes!A2:U`, token),
    sheetsFetch(`/values/Viagens!A2:X`, token),
    sheetsFetch(`/values/Vales!A2:H`, token),
    sheetsFetch(`/values/Boletos!A2:P`, token),
    sheetsFetch(`/values/Empresas!A2:D`, token),
    sheetsFetch(`/values/Fechamentos!A2:F`, token),
    sheetsFetch(`/values/DespesasVeiculo!A2:G`, token),
    sheetsFetch(`/values/TaxasPool!A2:E`, token),
    sheetsFetch(`/values/Motoristas!A2:B`, token),
    sheetsFetch(`/values/Contas!A2:B`, token),
    sheetsFetch(`/values/TrocasOleo!A2:F`, token),
    sheetsFetch(`/values/ServicosVeiculo!A2:G`, token),
    sheetsFetch(`/values/SemParar!A2:H`, token),
    sheetsFetch(`/values/Seguro!A2:L`, token),
    sheetsFetch(`/values/SemPararOutros!A2:E`, token),
    sheetsFetch(`/values/Config!A2:B`, token),
  ]);
  const trucks = (caminhoesRes.values || [])
    .filter((row) => row[0])
    .map(rowToTruck);
  const trips = (viagensRes.values || [])
    .filter((row) => row[0])
    .map(rowToTrip);
  const vales = (valesRes.values || [])
    .filter((row) => row[0])
    .map(rowToVale);
  const boletos = (boletosRes.values || [])
    .filter((row) => row[0])
    .map(rowToBoleto);
  const empresas = (empresasRes.values || [])
    .filter((row) => row[0])
    .map(rowToEmpresa);
  const fechamentos = (fechamentosRes.values || [])
    .filter((row) => row[0])
    .map(rowToFechamento);
  const despesasVeiculo = (despesasVeiculoRes.values || [])
    .filter((row) => row[0])
    .map(rowToDespesaVeiculo);
  const taxasPool = (taxasPoolRes.values || [])
    .filter((row) => row[0])
    .map(rowToTaxaPool);
  const motoristas = (motoristasRes.values || [])
    .filter((row) => row[0])
    .map(rowToMotorista);
  const contas = (contasRes.values || [])
    .filter((row) => row[0])
    .map(rowToConta);
  const trocasOleo = (trocasOleoRes.values || [])
    .filter((row) => row[0])
    .map(rowToTrocaOleo);
  const servicosVeiculo = (servicosVeiculoRes.values || [])
    .filter((row) => row[0])
    .map(rowToServicoVeiculo);
  const semParar = (semPararRes.values || [])
    .filter((row) => row[0])
    .map(rowToSemParar);
  const seguro = (seguroRes.values || [])
    .filter((row) => row[0])
    .map(rowToSeguro);
  const semPararOutros = (semPararOutrosRes.values || [])
    .filter((row) => row[0])
    .map(rowToSemPararOutro);
  const config = (configRes.values || [])
    .filter((row) => row[0])
    .map(rowToConfig);
  return { trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, seguro, semPararOutros, config };
}

// Cada aba tem: nome, cabeçalho, e a faixa de colunas usada (pra limpar sobras).
const SHEET_DEFS = {
  trucks: { nome: "Caminhoes", header: CAMINHOES_HEADER, colunas: "U", toRow: truckToRow },
  trips: { nome: "Viagens", header: VIAGENS_HEADER, colunas: "X", toRow: tripToRow },
  vales: { nome: "Vales", header: VALES_HEADER, colunas: "H", toRow: valeToRow },
  boletos: { nome: "Boletos", header: BOLETOS_HEADER, colunas: "P", toRow: boletoToRow },
  empresas: { nome: "Empresas", header: EMPRESAS_HEADER, colunas: "D", toRow: empresaToRow },
  fechamentos: { nome: "Fechamentos", header: FECHAMENTOS_HEADER, colunas: "F", toRow: fechamentoToRow },
  despesasVeiculo: { nome: "DespesasVeiculo", header: DESPESAS_VEICULO_HEADER, colunas: "G", toRow: despesaVeiculoToRow },
  taxasPool: { nome: "TaxasPool", header: TAXAS_POOL_HEADER, colunas: "E", toRow: taxaPoolToRow },
  motoristas: { nome: "Motoristas", header: MOTORISTAS_HEADER, colunas: "B", toRow: motoristaToRow },
  contas: { nome: "Contas", header: CONTAS_HEADER, colunas: "B", toRow: contaToRow },
  trocasOleo: { nome: "TrocasOleo", header: TROCAS_OLEO_HEADER, colunas: "F", toRow: trocaOleoToRow },
  servicosVeiculo: { nome: "ServicosVeiculo", header: SERVICOS_VEICULO_HEADER, colunas: "G", toRow: servicoVeiculoToRow },
  semParar: { nome: "SemParar", header: SEM_PARAR_HEADER, colunas: "H", toRow: semPararToRow },
  seguro: { nome: "Seguro", header: SEGURO_HEADER, colunas: "L", toRow: seguroToRow },
  semPararOutros: { nome: "SemPararOutros", header: SEM_PARAR_OUTROS_HEADER, colunas: "E", toRow: semPararOutroToRow },
  config: { nome: "Config", header: CONFIG_HEADER, colunas: "B", toRow: configToRow },
};

// Salva só as abas que de fato mudaram (chaves presentes em "changes").
// Pra cada aba: primeiro ESCREVE os dados novos (a aba nunca fica vazia por um instante),
// só depois limpa as linhas sobrando de antes (se o novo conjunto for menor que o anterior).
async function saveToSheets(token, changes) {
  for (const chave of Object.keys(changes)) {
    const def = SHEET_DEFS[chave];
    if (!def) continue;
    const lista = changes[chave] || [];
    const values = [def.header, ...lista.map(def.toRow)];
    // isto é o que realmente importa: escrever os dados novos. Se isso falhar,
    // sim, é um erro de verdade e a pessoa precisa ser avisada.
    await sheetsFetch(`/values/${def.nome}!A1?valueInputOption=RAW`, token, {
      method: "PUT",
      body: JSON.stringify({ range: `${def.nome}!A1`, values }),
    });
    // isto só limpa linhas velhas que sobraram de antes (quando a lista ficou
    // menor que era). Se isso falhar, os dados de verdade já estão salvos —
    // não faz sentido mostrar "erro ao salvar" por causa só dessa faxina, que
    // se resolve sozinha no próximo salvamento dessa mesma aba.
    const primeiraLinhaVazia = values.length + 1;
    if (primeiraLinhaVazia <= 5000) {
      try {
        await sheetsFetch(`/values/${def.nome}!A${primeiraLinhaVazia}:${def.colunas}5000:clear`, token, { method: "POST" });
      } catch (e) {
        // ignora de propósito — não é um erro que precisa travar o salvamento
      }
    }
  }
}

/* ---------- helpers ---------- */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
// pra campos de KM: aceita só dígitos, descartando ponto/vírgula que a pessoa
// digite sem querer achando que é separador de milhar (em campo type="number"
// o navegador sempre entende "." como separador DECIMAL, nunca de milhar —
// então "320.186" vira 320,186 = ~320, não 320 mil)
const onlyDigits = (v) => (v || "").replace(/[^\d]/g, "");

// redimensiona/comprime a foto do caminhão antes de guardar como base64 na
// planilha (célula do Sheets tem limite de ~50.000 caracteres) — reduz pra
// uma miniatura de até 480px de largura, em JPEG com qualidade reduzida
// decodifica o código de barras (44 dígitos) de um boleto bancário — pega o
// valor e a data de vencimento escondidos nos números. Só funciona pra boleto
// de banco (cobrança); boleto de concessionária/convênio (água, luz, tributo)
// tem outro formato e não tem valor embutido, então cai como null
// calcula o DV (dígito verificador) geral do código de barras de boleto de
// cobrança, com o mesmo cálculo (módulo 11) que o banco usa pra validar —
// serve pra pegar leitura errada da câmera (um dígito trocado) antes de
// aceitar, já que a câmera pode ler errado sem a gente perceber
function calcularDVGeralBoleto(codigo43semDV) {
  let soma = 0;
  let peso = 2;
  for (let i = codigo43semDV.length - 1; i >= 0; i--) {
    soma += Number(codigo43semDV[i]) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  const resto = soma % 11;
  if (resto === 0 || resto === 1 || resto === 10) return 1;
  return 11 - resto;
}

// confere se um código de barras de 44 dígitos (boleto de cobrança, não
// convênio) tem o DV geral batendo — se não bater, a leitura da câmera
// errou algum dígito e não vale a pena aceitar
function codigoBarrasBoletoValido(limpo) {
  if (!limpo || limpo.length !== 44) return false;
  if (limpo[0] === "8") return true; // convênio tem outra regra de DV, não confere aqui
  const semDV = limpo.slice(0, 4) + limpo.slice(5);
  const dvCalculado = calcularDVGeralBoleto(semDV);
  return dvCalculado === Number(limpo[4]);
}

// DV de cada campo da linha digitável usa módulo 10 (diferente do DV geral do
// código de barras, que usa módulo 11)
function modulo10Boleto(digitos) {
  let soma = 0;
  let peso = 2;
  for (let i = digitos.length - 1; i >= 0; i--) {
    let produto = Number(digitos[i]) * peso;
    if (produto > 9) produto = Math.floor(produto / 10) + (produto % 10);
    soma += produto;
    peso = peso === 2 ? 1 : 2;
  }
  const resto = soma % 10;
  return resto === 0 ? 0 : 10 - resto;
}

// converte o código de barras (44 dígitos, o que sai da leitura da câmera) na
// linha digitável (os 47 números com os pontinhos, que é o que a maioria dos
// apps de banco realmente espera quando você "cola o código pra pagar" — o
// código de barras cru sozinho não tem os dígitos verificadores de cada bloco
// e por isso alguns bancos recusam com "DV inválido"
function gerarLinhaDigitavel(codigoBarras) {
  if (!codigoBarras || codigoBarras.length !== 44 || codigoBarras[0] === "8") return null;
  const banco = codigoBarras.slice(0, 3);
  const moeda = codigoBarras.slice(3, 4);
  const dvGeral = codigoBarras.slice(4, 5);
  const fator = codigoBarras.slice(5, 9);
  const valor = codigoBarras.slice(9, 19);
  const campoLivre = codigoBarras.slice(19, 44);

  const campo1base = banco + moeda + campoLivre.slice(0, 5);
  const dv1 = modulo10Boleto(campo1base);
  const campo2base = campoLivre.slice(5, 15);
  const dv2 = modulo10Boleto(campo2base);
  const campo3base = campoLivre.slice(15, 25);
  const dv3 = modulo10Boleto(campo3base);

  const campo1 = `${campo1base}${dv1}`;
  const campo2 = `${campo2base}${dv2}`;
  const campo3 = `${campo3base}${dv3}`;

  // formatado com pontos, igual aparece impresso no boleto
  return `${campo1.slice(0, 5)}.${campo1.slice(5)} ${campo2.slice(0, 5)}.${campo2.slice(5)} ${campo3.slice(0, 5)}.${campo3.slice(5)} ${dvGeral} ${fator}${valor}`;
}

// caminho inverso: a pessoa digita a linha digitável (os 47 números com
// pontinhos, lidos direto do papel) e o app reconstrói o código de barras de
// 44 dígitos — serve de plano B quando a câmera não consegue ler direito
function linhaDigitavelParaCodigoBarras(linhaDigitavel) {
  const limpo = (linhaDigitavel || "").replace(/\D/g, "");
  if (limpo.length !== 47) return null;
  const campo1 = limpo.slice(0, 10);
  const campo2 = limpo.slice(10, 21);
  const campo3 = limpo.slice(21, 32);
  const dvGeral = limpo.slice(32, 33);
  const fatorValor = limpo.slice(33, 47);
  // confere o dígito verificador de cada campo (módulo 10) — se a pessoa
  // digitou algum número errado, isso pega o erro antes de aceitar
  const dv1Calculado = modulo10Boleto(campo1.slice(0, 9));
  const dv2Calculado = modulo10Boleto(campo2.slice(0, 10));
  const dv3Calculado = modulo10Boleto(campo3.slice(0, 10));
  if (String(dv1Calculado) !== campo1[9] || String(dv2Calculado) !== campo2[10] || String(dv3Calculado) !== campo3[10]) {
    return null;
  }
  const banco = campo1.slice(0, 3);
  const moeda = campo1.slice(3, 4);
  const livre1 = campo1.slice(4, 9);
  const livre2 = campo2.slice(0, 10);
  const livre3 = campo3.slice(0, 10);
  return banco + moeda + dvGeral + fatorValor + livre1 + livre2 + livre3;
}

function decodificarCodigoBarrasBoleto(codigo) {
  const limpo = (codigo || "").replace(/\D/g, "");
  if (limpo.length !== 44) return null;
  // segmento "8" no início é convênio/concessionária — não tem valor/data no mesmo lugar
  if (limpo[0] === "8") return null;
  const fatorVencimento = parseInt(limpo.slice(5, 9), 10);
  const valorCentavos = parseInt(limpo.slice(9, 19), 10);
  if (!fatorVencimento || Number.isNaN(valorCentavos)) return null;
  // data-base do fator de vencimento: a Febraban mudou a regra em 22/02/2025
  // (a data-base antiga, 07/10/1997, estourou o limite de 4 dígitos do fator
  // em 21/02/2025) — desde então a nova data-base é 29/05/2022. Como o app
  // roda em 2026+, todo boleto atual já usa essa regra nova
  const dataBase = new Date(Date.UTC(2022, 4, 29));
  const dataVencimento = new Date(dataBase.getTime() + fatorVencimento * 86400000);
  const iso = dataVencimento.toISOString().slice(0, 10);
  const valor = (valorCentavos / 100).toFixed(2);
  return { valor, dataVencimento: iso, codigoBarras: limpo, linhaDigitavel: gerarLinhaDigitavel(limpo) };
}

// carrega a biblioteca de leitura de código de barras (ZXing) via CDN, uma
// única vez — não vem empacotada no bundle, só é buscada quando a pessoa
// realmente abre o leitor pela primeira vez
let zxingCarregando = null;
function carregarScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Não consegui carregar ${src}. Confere sua internet.`));
    document.head.appendChild(script);
  });
}

// o leitor de código de barras pela câmera (BrowserMultiFormatReader) mora
// num pacote separado (@zxing/browser) do pacote com os formatos/decodificação
// (@zxing/library) — precisa carregar os dois, nessa ordem
function carregarZXing() {
  if (window.ZXing && window.ZXingBrowser) return Promise.resolve({ ZXing: window.ZXing, ZXingBrowser: window.ZXingBrowser });
  if (zxingCarregando) return zxingCarregando;
  zxingCarregando = carregarScript("https://unpkg.com/@zxing/library@latest")
    .then(() => carregarScript("https://unpkg.com/@zxing/browser@latest"))
    .then(() => {
      if (!window.ZXing || !window.ZXingBrowser) {
        zxingCarregando = null;
        throw new Error("As bibliotecas do leitor carregaram mas não ficaram disponíveis como esperado. Tenta atualizar a página e usar de novo.");
      }
      return { ZXing: window.ZXing, ZXingBrowser: window.ZXingBrowser };
    });
  return zxingCarregando;
}

function redimensionarFotoCaminhao(file, callback) {
  const leitor = new FileReader();
  leitor.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      // limite de segurança bem abaixo do máximo de 50.000 caracteres de uma
      // célula da planilha — se a primeira tentativa ficar grande demais
      // (depende de quanto detalhe a foto tem), vai reduzindo largura e
      // qualidade até caber, em vez de travar salvando sempre
      const LIMITE_SEGURO = 40000;
      const tentativas = [
        { largura: 480, qualidade: 0.6 },
        { largura: 400, qualidade: 0.5 },
        { largura: 320, qualidade: 0.45 },
        { largura: 260, qualidade: 0.4 },
        { largura: 200, qualidade: 0.35 },
      ];
      let resultado = "";
      for (const t of tentativas) {
        const escala = Math.min(1, t.largura / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resultado = canvas.toDataURL("image/jpeg", t.qualidade);
        if (resultado.length <= LIMITE_SEGURO) break;
      }
      if (resultado.length > LIMITE_SEGURO) {
        alert("Essa foto ainda ficou grande demais pra planilha mesmo depois de comprimir bastante. Tenta uma foto mais simples ou tirada de mais longe.");
        return;
      }
      callback(resultado);
    };
    img.src = ev.target.result;
  };
  leitor.readAsDataURL(file);
}

// foto do documento anual (CRLV) — um pouco maior que a foto do caminhão, pra
// dar pra ler o documento depois se precisar, mas ainda comprimida o
// suficiente pra caber numa célula da planilha
// converte um ArrayBuffer em base64 (usado no upload multipart pro Drive)
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const tamanhoPasso = 0x8000;
  for (let i = 0; i < bytes.length; i += tamanhoPasso) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + tamanhoPasso));
  }
  return btoa(binary);
}

// sobe um arquivo (foto ou PDF) pro Google Drive da própria pessoa, numa pasta
// dedicada do app — assim documentos grandes não ficam presos no limite de
// tamanho de uma célula da planilha. Guarda só o link no lugar do arquivo
// inteiro. Precisa do escopo "drive.file" (só arquivos criados pelo próprio
// app, não dá acesso ao Drive inteiro da pessoa)
let pastaDriveIdCache = null;
async function obterPastaDrive(token) {
  if (pastaDriveIdCache) return pastaDriveIdCache;
  const busca = await fetch(
    "https://www.googleapis.com/drive/v3/files?q=" + encodeURIComponent("name='Controle de Viagens - Documentos' and mimeType='application/vnd.google-apps.folder' and trashed=false") + "&fields=files(id,name)",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const dadosBusca = await busca.json();
  if (dadosBusca.files && dadosBusca.files.length > 0) {
    pastaDriveIdCache = dadosBusca.files[0].id;
    return pastaDriveIdCache;
  }
  const criar = await fetch("https://www.googleapis.com/drive/v3/files?fields=id", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Controle de Viagens - Documentos", mimeType: "application/vnd.google-apps.folder" }),
  });
  const dadosCriar = await criar.json();
  pastaDriveIdCache = dadosCriar.id;
  return pastaDriveIdCache;
}

async function uploadArquivoParaDrive(file, token, nomeArquivo) {
  const pastaId = await obterPastaDrive(token);
  const metadata = { name: nomeArquivo, mimeType: file.type || "application/octet-stream", parents: [pastaId] };
  const boundary = "-------cvdrive" + Date.now();
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  const arrayBuffer = await file.arrayBuffer();
  const base64Data = arrayBufferToBase64(arrayBuffer);

  const multipartBody =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${metadata.mimeType}\r\n` +
    "Content-Transfer-Encoding: base64\r\n\r\n" +
    base64Data +
    closeDelim;

  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body: multipartBody,
  });
  if (!res.ok) {
    const corpo = await res.text();
    throw new Error(`Google Drive: ${corpo}`);
  }
  return res.json();
}

function redimensionarFotoDocumento(file, callback) {
  // se for PDF, não dá pra "redimensionar" (não é imagem) — guarda direto como
  // veio, só avisando se ficar grande demais pra planilha
  if (file.type === "application/pdf") {
    const leitorPdf = new FileReader();
    leitorPdf.onload = (ev) => {
      const resultado = ev.target.result;
      if (resultado.length > 45000) {
        alert("Esse PDF ficou grande demais pra guardar na planilha. Se der, tira uma foto do documento em vez de anexar o PDF, ou usa um PDF mais leve/comprimido.");
        return;
      }
      callback(resultado);
    };
    leitorPdf.readAsDataURL(file);
    return;
  }
  const leitor = new FileReader();
  leitor.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const larguraMax = 900;
      const escala = Math.min(1, larguraMax / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL("image/jpeg", 0.55));
    };
    img.src = ev.target.result;
  };
  leitor.readAsDataURL(file);
}

// ícone genérico de caminhão, usado quando ainda não tem foto real cadastrada
function TruckIcon({ size = 64, color = "#B7BFC8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="24" width="32" height="20" rx="2" fill={color} />
      <path d="M36 30h14l8 8v6H36V30z" fill={color} opacity="0.7" />
      <rect x="40" y="33" width="9" height="7" fill="#fff" opacity="0.5" />
      <circle cx="16" cy="46" r="6" fill="#5A6472" />
      <circle cx="16" cy="46" r="2.5" fill="#EEF0F2" />
      <circle cx="46" cy="46" r="6" fill="#5A6472" />
      <circle cx="46" cy="46" r="2.5" fill="#EEF0F2" />
    </svg>
  );
}

// gráfico de linha bem simples, feito em SVG puro (sem depender de nenhuma
// biblioteca de gráfico) — usado pra mostrar a evolução do consumo km/l
// modal com câmera pra ler o código de barras do boleto — usa a biblioteca
// ZXing (carregada por CDN na hora) e a câmera do navegador, sem precisar de
// nenhum servidor. Formato ITF (Interleaved 2 of 5), que é o usado em boleto
function LeitorCodigoBarras({ onDetectado, onFechar }) {
  // dá um bipe curto (funciona em qualquer navegador, inclusive iPhone) e
  // tenta vibrar também (só funciona em Android — no iPhone o navegador não
  // deixa controlar a vibração, mas não dá erro nenhum tentando) — assim a
  // pessoa sabe na hora que o código foi lido, mesmo sem olhar pra tela
  const avisarLeituraOk = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const ganho = ctx.createGain();
      osc.frequency.value = 880;
      osc.connect(ganho);
      ganho.connect(ctx.destination);
      ganho.gain.setValueAtTime(0.3, ctx.currentTime);
      ganho.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) { /* navegador sem suporte a áudio — sem problema, ignora */ }
    if (navigator.vibrate) {
      try { navigator.vibrate(150); } catch (e) { /* ignora */ }
    }
  };

  const videoRef = useRef(null);
  const controleRef = useRef(null);
  const [statusLeitor, setStatusLeitor] = useState("carregando"); // carregando | lendo | erro
  const [erroMsg, setErroMsg] = useState("");
  const [ultimaLeituraBruta, setUltimaLeituraBruta] = useState("");
  const [tentativas, setTentativas] = useState(0);
  const [modoManual, setModoManual] = useState(null); // null = ainda escolhendo | true = manual/leitor USB | false = câmera
  const [linhaDigitada, setLinhaDigitada] = useState("");
  const [erroManual, setErroManual] = useState("");
  const [flashDisponivel, setFlashDisponivel] = useState(false);
  const [flashLigado, setFlashLigado] = useState(false);

  const alternarFlash = () => {
    const stream = videoRef.current && videoRef.current.srcObject;
    const track = stream && stream.getVideoTracks && stream.getVideoTracks()[0];
    if (!track) return;
    const novoEstado = !flashLigado;
    track.applyConstraints({ advanced: [{ torch: novoEstado }] })
      .then(() => setFlashLigado(novoEstado))
      .catch(() => alert("Não consegui controlar a lanterna nesse aparelho/navegador."));
  };

  useEffect(() => {
    if (modoManual !== false) return;
    let cancelado = false;
    carregarZXing()
      .then(({ ZXing, ZXingBrowser }) => {
        if (cancelado) return;
        const hints = new Map();
        hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [ZXing.BarcodeFormat.ITF, ZXing.BarcodeFormat.CODE_128]);
        hints.set(ZXing.DecodeHintType.TRY_HARDER, true);
        const leitor = new ZXingBrowser.BrowserMultiFormatReader(hints);
        setStatusLeitor("lendo");
        return leitor.decodeFromConstraints(
          { video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } } },
          videoRef.current,
          (resultado, erro, controle) => {
            controleRef.current = controle;
            // confere se o aparelho/navegador tem lanterna controlável — só
            // faz isso uma vez, assim que o vídeo estiver rodando
            if (!flashDisponivel && videoRef.current && videoRef.current.srcObject) {
              const track = videoRef.current.srcObject.getVideoTracks()[0];
              const capacidades = track && track.getCapabilities ? track.getCapabilities() : null;
              if (capacidades && capacidades.torch) setFlashDisponivel(true);
            }
            if (resultado) {
              const texto = resultado.getText().replace(/\D/g, "");
              setTentativas((n) => n + 1);
              setUltimaLeituraBruta(texto);
              // só aceita com os 44 dígitos certinhos E com o dígito
              // verificador batendo — se a câmera leu algum dígito errado,
              // o DV não bate, e é melhor pedir pra ler de novo do que
              // aceitar um código que o banco vai recusar depois
              if (texto.length === 44 && codigoBarrasBoletoValido(texto)) {
                controle.stop();
                avisarLeituraOk();
                onDetectado(texto);
              }
            }
          }
        );
      })
      .catch((e) => {
        if (cancelado) return;
        setStatusLeitor("erro");
        setErroMsg(e.message || "Não consegui acessar a câmera. Confere se você deu permissão.");
      });
    return () => {
      cancelado = true;
      if (controleRef.current) controleRef.current.stop();
    };
  }, [modoManual]);

  const confirmarLinhaManual = () => {
    const limpo = linhaDigitada.replace(/\D/g, "");
    // aceita tanto o código de barras cru (44 dígitos — o que sai de um
    // leitor físico USB/sem fio lendo direto as barras) quanto a linha
    // digitável (47 dígitos — os números impressos com pontinhos)
    if (limpo.length === 44) {
      if (!codigoBarrasBoletoValido(limpo)) {
        setErroManual("Esses 44 números não bateram com o dígito verificador do código de barras. Confere se não faltou/sobrou nenhum dígito.");
        return;
      }
      onDetectado(limpo);
      return;
    }
    if (limpo.length !== 47) {
      setErroManual(`Preciso de 44 números (código de barras) ou 47 números (linha digitável) — você digitou/leu ${limpo.length}. Confere se não faltou nenhum.`);
      return;
    }
    const codigoBarras = linhaDigitavelParaCodigoBarras(limpo);
    if (!codigoBarras) {
      setErroManual("Algum número não bateu com o dígito verificador — revisa se digitou tudo certinho, principalmente números parecidos (0/6/8, 1/7).");
      return;
    }
    onDetectado(codigoBarras);
  };

  if (modoManual === null) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "min(380px, 92vw)", background: "#1B2430", borderRadius: 14, padding: 20, textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Como você vai ler o código?</div>
          <button
            onClick={() => setModoManual(false)}
            style={{ width: "100%", background: "#2451A6", color: "#fff", border: "none", borderRadius: 10, padding: "14px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 10 }}
          >
            📷 Câmera do celular/computador
          </button>
          <button
            onClick={() => setModoManual(true)}
            style={{ width: "100%", background: "#D9A419", color: "#1B2430", border: "none", borderRadius: 10, padding: "14px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 10 }}
          >
            ⌨️ Leitor USB/sem fio, ou digitar
          </button>
          <button
            onClick={onFechar}
            style={{ width: "100%", background: "none", color: "#9AA5B1", border: "none", padding: "8px", cursor: "pointer", fontSize: 13 }}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  if (modoManual) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "min(420px, 92vw)", background: "#1B2430", borderRadius: 14, padding: 16 }}>
          <div style={{ color: "#fff", fontWeight: 700, marginBottom: 10 }}>✏️ Digite ou leia com o leitor</div>
          <div style={{ color: "#9AA5B1", fontSize: 12, marginBottom: 10 }}>
            Digite os 47 números da linha digitável (com pontinhos, no topo do boleto), ou se tiver um leitor de código de barras USB/sem fio, clica aqui na caixinha e escaneia — ele "digita" sozinho e confirma.
          </div>
          <input
            autoFocus
            value={linhaDigitada}
            onChange={(e) => { setLinhaDigitada(e.target.value); setErroManual(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") confirmarLinhaManual(); }}
            placeholder="00190000009025625970010005434417115240000016000"
            style={{ width: "100%", border: "1px solid #3A4351", background: "#fff", borderRadius: 10, padding: "10px 12px", fontSize: 14, fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums", boxSizing: "border-box" }}
          />
          {erroManual && <div style={{ color: "#FBA39A", fontSize: 12, marginTop: 8 }}>{erroManual}</div>}
          <button
            onClick={confirmarLinhaManual}
            style={{ width: "100%", marginTop: 12, background: "#2451A6", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, cursor: "pointer" }}
          >
            Confirmar
          </button>
          <button
            onClick={() => setModoManual(false)}
            style={{ width: "100%", marginTop: 8, background: "none", color: "#9AA5B1", border: "none", padding: "6px", cursor: "pointer", fontSize: 12, textDecoration: "underline" }}
          >
            Voltar pra câmera
          </button>
          <button
            onClick={() => { if (controleRef.current) controleRef.current.stop(); onFechar(); }}
            style={{ width: "100%", marginTop: 8, background: "#fff", color: "#1B2430", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, cursor: "pointer" }}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "min(420px, 92vw)", background: "#1B2430", borderRadius: 14, padding: 16, textAlign: "center" }}>
        <div style={{ color: "#fff", fontWeight: 700, marginBottom: 10 }}>📷 Aponte pro código de barras do boleto</div>
        <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", background: "#000", minHeight: 200 }}>
          <video ref={videoRef} style={{ width: "100%", display: "block" }} muted playsInline />
          {statusLeitor === "lendo" && (
            <div style={{ position: "absolute", left: "8%", right: "8%", top: "45%", height: 3, background: "#D9A419", boxShadow: "0 0 8px #D9A419" }} />
          )}
          {flashDisponivel && (
            <button
              onClick={alternarFlash}
              title="Ligar/desligar lanterna"
              style={{
                position: "absolute", top: 10, right: 10, width: 40, height: 40, borderRadius: 20,
                background: flashLigado ? "#D9A419" : "rgba(0,0,0,0.55)", border: "none", cursor: "pointer",
                fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              🔦
            </button>
          )}
        </div>
        {statusLeitor === "carregando" && <div style={{ color: "#9AA5B1", fontSize: 12, marginTop: 10 }}>Carregando o leitor...</div>}
        {statusLeitor === "erro" && <div style={{ color: "#FBEBE8", fontSize: 12, marginTop: 10 }}>{erroMsg}</div>}
        {statusLeitor === "lendo" && (
          <div style={{ color: "#9AA5B1", fontSize: 11, marginTop: 10, textAlign: "left" }}>
            💡 Dicas: afasta um pouco pro código de barras caber inteiro na tela, mantém firme, e procura boa luz (evita reflexo no papel).
            {tentativas > 0 && (
              <div style={{ marginTop: 6, color: "#D9A419" }}>
                Captou algo {tentativas}x, mas ainda não bateu certinho (último: {ultimaLeituraBruta.length} dígitos, conferência de segurança não passou). Ajusta a distância/luz e tenta de novo — é melhor demorar um pouco mais do que salvar um código errado.
              </div>
            )}
          </div>
        )}
        <button
          onClick={() => { if (controleRef.current) controleRef.current.stop(); setModoManual(true); }}
          style={{ width: "100%", marginTop: 12, background: "none", color: "#D9A419", border: "1px solid #D9A419", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
        >
          ✏️ Câmera não está pegando? Digitar a linha
        </button>
        <button
          onClick={() => { if (controleRef.current) controleRef.current.stop(); onFechar(); }}
          style={{ marginTop: 10, background: "#fff", color: "#1B2430", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, cursor: "pointer" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function MiniLineChart({ points, width = 320, height = 140, corLinha = "#2451A6" }) {
  if (!points || points.length === 0) {
    return <div style={{ fontSize: 12, color: "#9AA5B1", padding: "20px 0" }}>Ainda não tem dados suficientes pra montar o gráfico.</div>;
  }
  const margem = { top: 14, right: 14, bottom: 24, left: 34 };
  const w = width - margem.left - margem.right;
  const h = height - margem.top - margem.bottom;
  const valores = points.map((p) => p.valor);
  const minV = Math.min(...valores);
  const maxV = Math.max(...valores);
  const faixa = maxV - minV || 1;
  const passoX = points.length > 1 ? w / (points.length - 1) : 0;
  const coordX = (i) => margem.left + i * passoX;
  const coordY = (v) => margem.top + h - ((v - minV) / faixa) * h;
  const linha = points.map((p, i) => `${i === 0 ? "M" : "L"} ${coordX(i)} ${coordY(p.valor)}`).join(" ");

  return (
    <svg width={width} height={height} style={{ maxWidth: "100%" }}>
      {[0, 0.5, 1].map((f) => (
        <line key={f} x1={margem.left} x2={width - margem.right} y1={margem.top + h * f} y2={margem.top + h * f} stroke="#EEF0F2" strokeWidth="1" />
      ))}
      <path d={linha} fill="none" stroke={corLinha} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={coordX(i)} cy={coordY(p.valor)} r="3.5" fill={corLinha} />
      ))}
      {points.map((p, i) => (
        <text key={`label-${i}`} x={coordX(i)} y={height - 6} textAnchor="middle" fontSize="10" fill="#9AA5B1">
          {p.label}
        </text>
      ))}
    </svg>
  );
}

const BRL = (n) =>
  (Number(n) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
// formata litragem evitando aquele "resto" de ponto flutuante (ex: 2842.0950000000003
// em vez de 2842,095), que aparece ao somar vários decimais em JavaScript
const formatLitros = (n) =>
  (Number(n) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 3 });
const fmtDate = (d) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};
const emptyAbastecimento = () => ({ id: uid(), data: "", litragem: "", km: "", valor: "", posto: "", numeroCupom: "", tipo: "diesel", paraComissao: false });
const emptyGasto = () => ({ id: uid(), data: "", valor: "", descricao: "", categoria: "Despesas Estrada", setor: "", posto: "", numeroCupom: "", paraComissao: false, importante: false, empresa: "", km: "", gerarBoleto: false, vencimentoBoleto: "" });

const emptyTrip = () => ({
  id: uid(),
  caminhaoId: "",
  data: "",
  origem: "",
  destino: "",
  kmInicio: "",
  kmFim: "",
  dataFim: "",
  contrato: "",
  adiantamento: "",
  dataRecebAdiantamento: "",
  saldoReceber: "",
  dataPagamentoSaldo: "",
  empresa: "",
  motorista: "",
  valorComissaoBase: "",
  pedagio: "",
  carregamento: "",
  comissaoFixa: false,
  valorComissaoFixa: "",
  comissaoJaPaga: false,
  carregamentoMotorista: "",
  abastecimentos: [emptyAbastecimento()],
  gastosExtras: [emptyGasto()],
});

// migra viagens antigas (campos unicos) para o novo formato de listas
const normalizeTrip = (t) => {
  if (t.abastecimentos && t.gastosExtras) return t;
  const abastecimentos =
    t.dataAbastecimento || t.litragem || t.kmAbastecimento || t.valorAbastecimento || t.posto
      ? [{ id: uid(), data: t.dataAbastecimento || "", litragem: t.litragem || "", km: t.kmAbastecimento || "", valor: t.valorAbastecimento || "", posto: t.posto || "" }]
      : [emptyAbastecimento()];
  const gastosExtras =
    t.dataGasto || t.valorGasto || t.descricaoGasto
      ? [{ id: uid(), data: t.dataGasto || "", valor: t.valorGasto || "", descricao: t.descricaoGasto || "" }]
      : [emptyGasto()];
  return { ...t, abastecimentos, gastosExtras };
};

const valorTotal = (t) => (Number(t.adiantamento) || 0) + (Number(t.saldoReceber) || 0);

// Configurações ajustáveis pela própria Laís, na tela de Configurações — ficam
// guardadas na aba "Config" da planilha. Esses valores aqui são só o "padrão de
// fábrica" caso a aba ainda não tenha sido carregada nem uma vez.
let CONFIG_PERCENTUAL_COMISSAO = 13;
let CONFIG_INTERVALO_OLEO_KM = 25000;
// regra de vencimento por seguradora — cada uma pode vencer num dia diferente do
// mês, e "antecipar" ou não pra sexta-feira quando esse dia cai em fim de semana
let CONFIG_REGRAS_VENCIMENTO_SEGURO = [
  { seguradora: "ATCMG", dia: 15, antecipaFimDeSemana: true },
  { seguradora: "TRANSPOSEG", dia: 1, antecipaFimDeSemana: false },
];

// calcula o vencimento do boleto de uma seguradora naquele mês, usando a regra dela
// (dia 15 com antecipação pra sexta-feira, se não tiver regra própria configurada)
function vencimentoSeguro(seguradora, mesAno) {
  const nome = (seguradora || "").toUpperCase();
  const regra = CONFIG_REGRAS_VENCIMENTO_SEGURO.find((r) => r.seguradora.toUpperCase() === nome);
  const dia = regra ? regra.dia : 15;
  const antecipa = regra ? regra.antecipaFimDeSemana : true;
  const [ano, mes] = mesAno.split("-").map(Number);
  const d = new Date(ano, mes - 1, dia);
  if (antecipa) {
    const diaSemana = d.getDay(); // 0 = domingo, 6 = sabado
    if (diaSemana === 6) d.setDate(d.getDate() - 1);
    else if (diaSemana === 0) d.setDate(d.getDate() - 2);
  }
  return d.toISOString().slice(0, 10);
}

// comissao: normalmente X% (configurável) em cima do valor de comissão menos
// pedágio. O carregamento (quando teve troca de motorista no meio da viagem) é
// um valor fixo que vai inteiro pro outro motorista — por isso é descontado
// DEPOIS de calcular o percentual, não antes (senão só uns 13% dele seria
// descontado do motorista principal, em vez do valor cheio). Mas se a viagem
// estiver marcada como "comissão prefixada", usa direto o valor que foi
// digitado, sem calcular porcentagem nem descontar nada.
const comissao = (t) => {
  if (t.comissaoFixa) return Math.max(0, Number(t.valorComissaoFixa) || 0);
  const base = Number(t.valorComissaoBase) || 0;
  const pedagio = Number(t.pedagio) || 0;
  const carregamento = Number(t.carregamento) || 0;
  const comissaoBruta = (base - pedagio) * (CONFIG_PERCENTUAL_COMISSAO / 100);
  return Math.max(0, comissaoBruta - carregamento);
};

// intervalo de km da troca de óleo — cada caminhão pode ter o próprio valor
// (ex: marca diferente, troca em km diferente); se não tiver, usa o padrão geral
const intervaloOleoDoCaminhao = (truck) => {
  const proprio = Number(truck && truck.intervaloOleoKm);
  return proprio > 0 ? proprio : CONFIG_INTERVALO_OLEO_KM;
};

// Fechamentos antigos (de antes dessa correção) guardavam só a data, e decidiam o que
// já tinha sido pago comparando data da viagem/vale com a data do fechamento. Isso causava
// um bug quando um lançamento era do MESMO DIA de um fechamento. Essa função "converte"
// fechamentos antigos pra guardar exatamente quais viagens/vales foram considerados —
// calculando isso do jeito EXATO que já era calculado antes (mesma janela de datas), então
// não muda nenhum valor nem lançamento já fechado. So passa a travar isso numa lista fixa,
// em vez de recalcular por data toda vez (que é o que gerava o bug em lançamentos novos).
const normalizarNomeMotorista = (nome) => (nome || "").trim().replace(/\s+/g, " ").toLowerCase();

function migrarFechamentosAntigos(fechamentos, trips, vales) {
  // reprocessa quem nunca foi migrado, e também quem ficou com lista vazia por engano
  // (ex: por causa de um nome de motorista que não bateu na comparação)
  const precisaMigrar = fechamentos.some(
    (f) => !f.tripIds || !f.valeIds || (f.tripIds.length === 0 && f.valeIds.length === 0)
  );
  if (!precisaMigrar) return fechamentos;

  const porMotorista = {};
  fechamentos.forEach((f) => {
    const chave = normalizarNomeMotorista(f.motorista);
    (porMotorista[chave] = porMotorista[chave] || []).push(f);
  });
  Object.values(porMotorista).forEach((arr) => arr.sort((a, b) => (a.data || "").localeCompare(b.data || "")));

  return fechamentos.map((f) => {
    const jaTinhaAlgo = f.tripIds && f.valeIds && (f.tripIds.length > 0 || f.valeIds.length > 0);
    if (jaTinhaAlgo) return f;
    const chaveFechamento = normalizarNomeMotorista(f.motorista);
    const arr = porMotorista[chaveFechamento] || [];
    const idx = arr.findIndex((x) => x.id === f.id);
    const inicioJanela = idx > 0 ? arr[idx - 1].data : "";
    const fimJanela = f.data;
    const tripIds = trips
      .filter((t) => normalizarNomeMotorista(t.motorista) === chaveFechamento && comissao(t) > 0)
      .filter((t) => (t.data || "") > inicioJanela && (t.data || "") <= fimJanela)
      .map((t) => t.id);
    const valeIds = vales
      .filter((v) => normalizarNomeMotorista(v.motorista) === chaveFechamento)
      .filter((v) => (v.data || "") > inicioJanela && (v.data || "") <= fimJanela)
      .map((v) => v.id);
    return { ...f, tripIds, valeIds };
  });
}

// Antes de existir a distinção cavalo/carreta, toda placa nova (mesmo as de carreta
// adicionadas pelo campo de carreta do Seguro) ficava marcada como "cavalo" por padrão.
// Aqui a gente corrige isso sozinho: qualquer placa que já apareceu como carreta em
// algum lançamento de Seguro passa a ser marcada como carreta de verdade — sem mexer
// em nenhum outro dado.
function migrarTiposDePlaca(trucks, seguro) {
  const idsUsadosComoCarreta = new Set(
    seguro.map((s) => s.carretaCaminhaoId).filter(Boolean)
  );
  const precisaMigrar = trucks.some((t) => idsUsadosComoCarreta.has(t.id) && t.tipo !== "carreta");
  if (!precisaMigrar) return trucks;
  return trucks.map((t) =>
    idsUsadosComoCarreta.has(t.id) && t.tipo !== "carreta" ? { ...t, tipo: "carreta" } : t
  );
}

// Deixa o nome de toda empresa sempre em MAIÚSCULA — tanto no cadastro quanto nos
// boletos já lançados (que tinham o nome espalhado com grafias diferentes, tipo
// "abc transportes" e "ABC Transportes"). Sem atualizar os boletos junto, cada
// grafia diferente viraria uma "empresa" separada nos relatórios e categorias.
function migrarEmpresasParaMaiuscula(empresas, boletos) {
  const paraMaiuscula = (s) => (s || "").trim().toUpperCase();
  const precisaMigrar =
    empresas.some((e) => e.nome !== paraMaiuscula(e.nome)) ||
    boletos.some((b) => b.empresa && b.empresa !== paraMaiuscula(b.empresa));
  if (!precisaMigrar) return { empresas, boletos };

  const porNomeMaiusculo = {};
  empresas.forEach((e) => {
    const chave = paraMaiuscula(e.nome);
    if (!chave) return;
    if (!porNomeMaiusculo[chave]) {
      porNomeMaiusculo[chave] = { id: e.id, nome: chave, categoria: e.categoria || "" };
    } else if (!porNomeMaiusculo[chave].categoria && e.categoria) {
      porNomeMaiusculo[chave].categoria = e.categoria;
    }
  });
  const nextEmpresas = Object.values(porNomeMaiusculo);
  const nextBoletos = boletos.map((b) => (b.empresa ? { ...b, empresa: paraMaiuscula(b.empresa) } : b));

  return { empresas: nextEmpresas, boletos: nextBoletos };
}

/* ---------- plate chip (signature element) ---------- */
function PlateChip({ placa, active, onClick, size = "md" }) {
  const pad = size === "sm" ? "4px 10px" : "6px 14px";
  const fs = size === "sm" ? 12 : 15;
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "stretch",
        borderRadius: 10,
        overflow: "hidden",
        border: active ? "2px solid #D9A419" : "2px solid transparent",
        boxShadow: active
          ? "0 2px 10px rgba(217,164,25,0.35)"
          : "0 1px 3px rgba(27,36,48,0.15)",
        cursor: "pointer",
        transition: "transform .15s ease, box-shadow .15s ease",
        transform: active ? "translateY(-1px)" : "none",
        background: "none",
        padding: 0,
      }}
    >
      <span style={{ background: "#2451A6", width: 8 }} />
      <span
        style={{
          background: "#fff",
          color: "#1B2430",
          fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums",
          fontWeight: 700,
          fontSize: fs,
          padding: pad,
          letterSpacing: 1,
        }}
      >
        {placa || "SEM PLACA"}
      </span>
    </button>
  );
}

/* ---------- stat sign ---------- */
function MileSign({ label, value, tone, onClick, caption, toggle, full, icon }) {
  const tones = {
    blue: { bg: "#EEF2FA", fg: "#2451A6", ring: "#2451A6" },
    amber: { bg: "#FFF6E2", fg: "#8A5A00", ring: "#D9A419" },
    green: { bg: "#E9F5F1", fg: "#12503F", ring: "#1F6F5C" },
    red: { bg: "#FBEBE8", fg: "#7A2A1D", ring: "#B0402E" },
  }[tone];
  return (
    <div
      onClick={onClick}
      style={{
        background: `linear-gradient(160deg, #fff 0%, ${tones.bg} 100%)`,
        border: "1px solid #EDEFF2",
        borderRadius: 14,
        boxShadow: "0 2px 8px rgba(27,36,48,0.06)",
        padding: "16px 18px",
        minWidth: full ? 0 : 150,
        width: full ? "100%" : undefined,
        height: full ? "100%" : undefined,
        boxSizing: "border-box",
        flex: full ? "1 1 auto" : "1 1 150px",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          fontStyle: "italic",
          fontWeight: 600,
          letterSpacing: 0.4,
          textTransform: "uppercase",
          color: tones.fg,
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {icon && (
          <span
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 26, height: 26, borderRadius: 8, background: "#fff",
              boxShadow: `0 0 0 1px ${tones.ring}33`, fontSize: 14, flexShrink: 0,
            }}
          >
            {icon}
          </span>
        )}
        {label}
        {onClick && <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.7 }}>▸ ver lista</span>}
      </div>
      <div
        style={{
          fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums",
          fontWeight: 700,
          fontSize: 24,
          color: "#1B2430",
        }}
      >
        {value}
      </div>
      {caption && (
        <div style={{ fontSize: 11, color: "#9AA5B1", marginTop: 4 }}>
          {caption}
        </div>
      )}
      {toggle && (
        <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 6 }}>
          {toggle}
        </div>
      )}
    </div>
  );
}

/* ---------- field ---------- */
function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
      <span style={{ color: "#2451A6", fontWeight: 600 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  border: "1px solid #D7DBE0",
  borderRadius: 10,
  padding: "8px 10px",
  fontSize: 14,
  fontFamily: "'Inter', sans-serif",
  color: "#1B2430",
  background: "#fff",
  outline: "none",
};

function NovoMotoristaForm({ visible, onCancel, onConfirm, inputStyle }) {
  const [nome, setNome] = useState("");
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("vale");
  const [obs, setObs] = useState("");

  if (!visible) return null;

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-end", background: "#F7F8F9", padding: 10, borderRadius: 12, marginBottom: 16 }}>
      <Field label="Nome do motorista">
        <input style={inputStyle} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="digite o nome" autoFocus />
      </Field>
      <Field label="Tipo">
        <select style={inputStyle} value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="vale">Vale (adiantamento pago a ele)</option>
          <option value="reembolso">Reembolso (ele pagou, devemos a ele)</option>
        </select>
      </Field>
      <Field label="Data">
        <input type="date" style={inputStyle} value={data} onChange={(e) => setData(e.target.value)} onBlur={(e) => setData(corrigirAnoDigitado(e.target.value))} />
      </Field>
      <Field label="Valor (R$)">
        <input type="number" style={{ ...inputStyle, width: 100 }} value={valor} onChange={(e) => setValor(e.target.value)} />
      </Field>
      <Field label="Observação (opcional)">
        <input style={{ ...inputStyle, width: 140 }} value={obs} onChange={(e) => setObs(e.target.value)} />
      </Field>
      <button onClick={() => onConfirm(nome, data, valor, tipo, obs)} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, cursor: "pointer" }}>
        Salvar
      </button>
      <button onClick={onCancel} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}>
        Cancelar
      </button>
    </div>
  );
}


function RepeatingSection({ title, icon, items, onAdd, onRemove, onUpdate, addLabel, addColor, renderItem }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 0.2,
          color: "#1B2430",
          borderBottom: "2px solid #EEF0F2",
          paddingBottom: 6,
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {icon && <span>{icon}</span>}
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#F7F8F9",
              border: "1px solid #E3E7EB",
              borderRadius: 12,
              padding: "12px",
              position: "relative",
            }}
          >
            {items.length > 1 && (
              <button
                onClick={() => onRemove(item.id)}
                title="Remover"
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "#B0402E",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  fontSize: 12,
                  lineHeight: "16px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))", gap: 10, paddingRight: 20 }}>
              {renderItem(item, (updated) => onUpdate(item.id, updated))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onAdd}
        style={{
          marginTop: 10,
          border: `2px dashed ${addColor || "#B7BFC8"}`,
          background: "transparent",
          borderRadius: 10,
          padding: "8px 14px",
          fontSize: 13,
          fontWeight: addColor ? 700 : 400,
          color: addColor || "#5A6472",
          cursor: "pointer",
        }}
      >
        {addLabel}
      </button>
    </div>
  );
}


function Section({ title, icon, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 0.2,
          color: "#1B2430",
          borderBottom: "2px solid #EEF0F2",
          paddingBottom: 6,
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {icon && <span>{icon}</span>}
        {title}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

const CONTAS_COMUNS = [
  "Banco do Brasil Física",
  "Banco do Brasil Jurídica",
  "Sicoob",
  "Sicredi Jurídica",
  "Sicredi X",
  "Sicredi AGF",
  "Bradesco Física",
  "Bradesco Jurídica",
  "Cartão",
];

const CATEGORIAS_EMPRESA = [
  "Caminhões",
  "Despesas Operacionais",
  "Financiamentos, Bancos e Cartões",
  "Funcionários",
  "Administrativo",
  "Outros",
];

const emptyBoleto = () => ({
  id: uid(),
  empresa: "",
  descricao: "",
  notaFiscal: "",
  valor: "",
  dataVencimento: "",
  contaBancaria: "",
  dataPagamento: "",
  observacao: "",
  desconto: "",
  descontoDescricao: "",
  juros: "",
  baixas: [],
  codigoBarras: "",
  linhaDigitavel: "",
  novoVencimento: "",
});

// checklist de empresas agrupado por categoria, com marcar/desmarcar todas — usado
// tanto na tela principal de Boletos quanto no relatório, pra não ficar uma lista
// corrida bagunçada quando tem muita empresa cadastrada
function EmpresasChecklist({ titulo, empresasList, empresas, empresasSelecionadas, onToggle, onMarcarTodas, onDesmarcarTodas, onResetPadrao }) {
  const [categoriasFechadas, setCategoriasFechadas] = useState({});
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (!aberto) return;
    const aoClicarFora = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setAberto(false);
    };
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, [aberto]);

  const buscaNormalizada = busca.trim().toLowerCase();
  const porCategoria = {};
  empresasList
    .filter((nome) => !buscaNormalizada || nome.toLowerCase().includes(buscaNormalizada))
    .forEach((nome) => {
      const cadastro = empresas.find((e) => e.nome === nome);
      const categoria = (cadastro && cadastro.categoria) || "Outros";
      (porCategoria[categoria] = porCategoria[categoria] || []).push(nome);
    });
  const ordemCategorias = [...CATEGORIAS_EMPRESA.filter((c) => porCategoria[c]), ...Object.keys(porCategoria).filter((c) => !CATEGORIAS_EMPRESA.includes(c))];

  return (
    <div ref={containerRef} style={{ position: "relative", maxWidth: 340 }}>
      <button
        onClick={() => setAberto((v) => !v)}
        style={{
          width: "100%", textAlign: "left", background: "#fff", border: "1px solid #D7DBE0", borderRadius: 10,
          padding: "8px 10px", fontSize: 14, fontFamily: "'Inter', sans-serif", color: aberto ? "#2451A6" : "#1B2430",
          cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
          borderColor: aberto ? "#2451A6" : "#D7DBE0",
        }}
      >
        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {titulo} <span style={{ color: "#9AA5B1" }}>({empresasSelecionadas.length} de {empresasList.length})</span>
        </span>
        <span style={{ transform: aberto ? "rotate(180deg)" : "none", transition: "transform 0.15s", color: "#9AA5B1", flexShrink: 0 }}>▾</span>
      </button>

      {aberto && (
        <div
          className="painel-modal"
          style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 20,
            background: "#fff", border: "1px solid #E4E7EB", borderRadius: 14, boxShadow: "0 12px 32px rgba(27,36,48,0.14)",
            padding: 12, width: 340, height: 420, minWidth: 260, minHeight: 200,
            maxWidth: "80vw", maxHeight: "80vh", overflow: "auto", resize: "both",
          }}
        >
          <input
            autoFocus
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="🔎 Pesquisar empresa..."
            style={{ width: "100%", border: "1px solid #D7DBE0", borderRadius: 10, padding: "8px 10px", fontSize: 13, marginBottom: 10, outline: "none" }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <button onClick={onMarcarTodas} style={{ background: "#EEF2FA", border: "none", borderRadius: 20, padding: "4px 10px", color: "#2451A6", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>marcar todas</button>
            <button onClick={onDesmarcarTodas} style={{ background: "#EEF2FA", border: "none", borderRadius: 20, padding: "4px 10px", color: "#2451A6", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>desmarcar todas</button>
            <button onClick={onResetPadrao} style={{ background: "#F7F8F9", border: "none", borderRadius: 20, padding: "4px 10px", color: "#5A6472", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>usar padrão</button>
          </div>
          {ordemCategorias.length === 0 && (
            <div style={{ fontSize: 12, color: "#9AA5B1", textAlign: "center", padding: "16px 0" }}>Nenhuma empresa encontrada.</div>
          )}
          {ordemCategorias.map((categoria) => {
            const fechada = categoriasFechadas[categoria];
            const nomesDaCategoria = porCategoria[categoria];
            const marcadasDaCategoria = nomesDaCategoria.filter((n) => empresasSelecionadas.includes(n)).length;
            return (
              <div key={categoria} style={{ marginBottom: 4 }}>
                <button
                  onClick={() => setCategoriasFechadas((prev) => ({ ...prev, [categoria]: !prev[categoria] }))}
                  style={{ background: "#F7F8F9", borderRadius: 10, border: "none", padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 12, color: "#3A4351", width: "100%", textTransform: "uppercase", letterSpacing: 0.3 }}
                >
                  <span style={{ display: "inline-block", transform: fechada ? "rotate(-90deg)" : "none", transition: "transform 0.15s", color: "#9AA5B1" }}>▾</span>
                  {categoria}
                  <span style={{ fontSize: 11, color: "#9AA5B1", fontWeight: 500, marginLeft: "auto" }}>{marcadasDaCategoria}/{nomesDaCategoria.length}</span>
                </button>
                {!fechada && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 4, marginBottom: 6 }}>
                    {nomesDaCategoria.map((nome) => {
                      const marcada = empresasSelecionadas.includes(nome);
                      return (
                        <label
                          key={nome}
                          style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", padding: "6px 8px", borderRadius: 10, color: marcada ? "#1B2430" : "#5A6472", background: marcada ? "#EEF2FA" : "transparent" }}
                        >
                          <input type="checkbox" checked={marcada} onChange={() => onToggle(nome)} style={{ accentColor: "#2451A6" }} />
                          {nome}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// dropdown de período — junta os atalhos (Hoje/Esta semana/Este mês/Tudo) e o
// intervalo De/Até personalizado num único campo, pra não ocupar tanto espaço
function PeriodoDropdown({ periodStart, periodEnd, onQuickPeriod, onChangeStart, onChangeEnd }) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!aberto) return;
    const aoClicarFora = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setAberto(false);
    };
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, [aberto]);

  const rotulo = periodStart && periodEnd
    ? (periodStart === periodEnd ? fmtDate(periodStart) : `${fmtDate(periodStart)} a ${fmtDate(periodEnd)}`)
    : "Selecione o período";

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        onClick={() => setAberto((v) => !v)}
        style={{
          width: "100%", textAlign: "left", background: "#fff", border: "1px solid #D7DBE0", borderRadius: 10,
          padding: "8px 10px", fontSize: 14, fontFamily: "'Inter', sans-serif", color: aberto ? "#2451A6" : "#1B2430",
          cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
          borderColor: aberto ? "#2451A6" : "#D7DBE0", whiteSpace: "nowrap",
        }}
      >
        <span>📅 {rotulo}</span>
        <span style={{ transform: aberto ? "rotate(180deg)" : "none", transition: "transform 0.15s", color: "#9AA5B1", flexShrink: 0 }}>▾</span>
      </button>

      {aberto && (
        <div
          className="painel-modal periodo-dropdown-painel"
          style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 20,
            background: "#fff", border: "1px solid #E4E7EB", borderRadius: 14, boxShadow: "0 12px 32px rgba(27,36,48,0.14)",
            padding: 14, width: 280, maxWidth: "80vw",
          }}
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {[
              { id: "hoje", rotulo: "Hoje" },
              { id: "semana", rotulo: "Esta semana" },
              { id: "mes", rotulo: "Este mês" },
              { id: "tudo", rotulo: "Tudo" },
            ].map((op) => (
              <button
                key={op.id}
                onClick={() => { onQuickPeriod(op.id); setAberto(false); }}
                style={{ fontSize: 12, padding: "6px 12px", borderRadius: 20, border: "1px solid #D7DBE0", background: "#F7F8F9", color: "#3A4351", cursor: "pointer", fontWeight: 600 }}
              >
                {op.rotulo}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9AA5B1", textTransform: "uppercase", marginBottom: 6 }}>
            Ou escolha o intervalo
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Field label="De">
              <input type="date" style={inputStyle} value={periodStart} onChange={(e) => onChangeStart(e.target.value)} onBlur={(e) => onChangeStart(corrigirAnoDigitado(e.target.value))} />
            </Field>
            <Field label="Até">
              <input type="date" style={inputStyle} value={periodEnd} onChange={(e) => onChangeEnd(e.target.value)} onBlur={(e) => onChangeEnd(corrigirAnoDigitado(e.target.value))} />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}

function BoletosView({
  boletos, onSave, onSaveMultiple, onDelete,
  reportOpen, setReportOpen, periodStart, setPeriodStart, periodEnd, setPeriodEnd,
  empresasSelecionadas, onToggleEmpresaSelecionada, onMarcarTodasEmpresas, onDesmarcarTodasEmpresas, onResetEmpresasParaPadrao,
  statusReportFilter, setStatusReportFilter, empresasList, report, exportCSV,
  empresas, onAddEmpresa, onRemoveEmpresa, onRenameEmpresa, onSetCategoriaEmpresa, onSetCategoriaEmpresaPorNome, onSetIncluirRelatorioEmpresa,
  categoriasEmpresaLista, onAdicionarCategoriaEmpresa, onRenomearCategoriaEmpresa, onRemoverCategoriaEmpresa,
  contasList, onAddConta,
  boletoParaAbrirId, onBoletoAberto,
}) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [boletoTravado, setBoletoTravado] = useState(false);
  const [leitorAberto, setLeitorAberto] = useState(false);
  const [listFilter, setListFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | pendente | vencido | pago
  const [newEmpresaName, setNewEmpresaName] = useState("");
  const [addingEmpresa, setAddingEmpresa] = useState(false);
  const [gerenciarEmpresasOpen, setGerenciarEmpresasOpen] = useState(false);
  const [novaEmpresaCadastro, setNovaEmpresaCadastro] = useState("");
  const [editandoNomeEmpresaId, setEditandoNomeEmpresaId] = useState(null);
  const [editandoNomeEmpresaValor, setEditandoNomeEmpresaValor] = useState("");
  const [novaCategoriaNome, setNovaCategoriaNome] = useState("");
  const [addingCategoria, setAddingCategoria] = useState(false);
  const [editandoCategoriaIndice, setEditandoCategoriaIndice] = useState(null);
  const [editandoCategoriaValor, setEditandoCategoriaValor] = useState("");
  const [novaBaixaData, setNovaBaixaData] = useState(() => new Date().toISOString().slice(0, 10));
  const [novaBaixaValor, setNovaBaixaValor] = useState("");
  const [novaBaixaObs, setNovaBaixaObs] = useState("");
  const [novaBaixaConta, setNovaBaixaConta] = useState("");

  const emptyParcela = () => ({ id: uid(), descricao: "", valor: "", dataVencimento: "", contaBancaria: "", dataPagamento: "", observacao: "", repetirFreq: "nenhuma", repetirQtd: 1 });
  const [novoOpen, setNovoOpen] = useState(false);
  const [novoEmpresa, setNovoEmpresa] = useState("");
  const [novoNotaFiscal, setNovoNotaFiscal] = useState("");
  const [novoValorNota, setNovoValorNota] = useState("");
  const [novoQtdDividir, setNovoQtdDividir] = useState("");
  const [novoEmpresaCustom, setNovoEmpresaCustom] = useState(false);
  const [novoParcelas, setNovoParcelas] = useState([emptyParcela()]);
  const [leitorParcelaId, setLeitorParcelaId] = useState(null);
  const [parcelasPreview, setParcelasPreview] = useState(null);

  const hoje = new Date().toISOString().slice(0, 10);

  const setQuickPeriod = (kind) => {
    const d = new Date();
    if (kind === "hoje") {
      const iso = d.toISOString().slice(0, 10);
      setPeriodStart(iso);
      setPeriodEnd(iso);
    } else if (kind === "semana") {
      const day = d.getDay();
      const start = new Date(d); start.setDate(d.getDate() - day);
      const end = new Date(d); end.setDate(d.getDate() + (6 - day));
      setPeriodStart(start.toISOString().slice(0, 10));
      setPeriodEnd(end.toISOString().slice(0, 10));
    } else if (kind === "mes") {
      setPeriodStart(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10));
      setPeriodEnd(new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10));
    } else if (kind === "tudo") {
      setPeriodStart("2000-01-01");
      setPeriodEnd("2099-12-31");
    }
  };

  // stats e lista usam o mesmo `report` (período + empresas selecionadas) que
  // alimenta o relatório/PDF, assim a tela e o relatório exportado sempre batem
  const boletoBateBusca = (b, termo) => {
    if (!termo) return true;
    const alvo = termo.toLowerCase();
    return (
      (b.empresa || "").toLowerCase().includes(alvo) ||
      (b.descricao || "").toLowerCase().includes(alvo) ||
      (b.observacao || "").toLowerCase().includes(alvo) ||
      (b.notaFiscal || "").toLowerCase().includes(alvo)
    );
  };

  // se a pessoa colocar um "novo vencimento" (ex: depois de uma baixa
  // parcial, renegociando o saldo restante), usa essa data no lugar da
  // original pra filtro de período e pra decidir se está vencido — sem
  // apagar a data original, que fica só de referência/histórico
  const vencimentoEfetivo = (b) => b.novoVencimento || b.dataVencimento;

  const visibleBoletos = useMemo(() => {
    return report.items
      .filter((b) => boletoBateBusca(b, listFilter))
      .filter((b) => statusFilter === "all" || b.__status === statusFilter)
      .sort((a, b) => (a.__dataItem || "").localeCompare(b.__dataItem || ""));
  }, [report.items, listFilter, statusFilter]);

  // os cartõezinhos (Boletos/Pendente/Vencido/Pago) precisam bater com as
  // empresas selecionadas e a busca — sem entrar no filtro de status, já que
  // são eles que mostram a divisão por status. "Boletos" conta boletos
  // distintos (um boleto pago em duas baixas não conta em dobro)
  const statsCards = useMemo(() => {
    const baseItems = report.items.filter((b) => boletoBateBusca(b, listFilter));
    const distintos = new Set(baseItems.map((b) => b.id));
    const totals = baseItems.reduce(
      (acc, b) => {
        if (b.__kind === "pago") acc.pago += b.__valorItem;
        else if (b.__status === "vencido") acc.vencido += b.__valorItem;
        else acc.pendente += b.__valorItem;
        return acc;
      },
      { pendente: 0, vencido: 0, pago: 0 }
    );
    return { count: distintos.size, ...totals };
  }, [report.items, listFilter]);

  const openNew = () => {
    setNovoEmpresa("");
    setNovoNotaFiscal("");
    setNovoValorNota("");
    setNovoQtdDividir("");
    setNovoParcelas([emptyParcela()]);
    setNovoEmpresaCustom(false);
    setParcelasPreview(null);
    setNovoOpen(true);
  };

  const dividirEmParcelas = () => {
    const total = Number(novoValorNota) || 0;
    const qtd = Math.max(1, Number(novoQtdDividir) || 0);
    if (total <= 0) {
      alert("Preencha o valor total da nota primeiro.");
      return;
    }
    if (qtd <= 0) {
      alert("Preencha em quantas parcelas quer dividir.");
      return;
    }
    // divide igual, e joga o resto do arredondamento na ultima parcela,
    // pra soma bater certinho com o valor total da nota
    const valorParcela = Math.floor((total / qtd) * 100) / 100;
    const somaAteAntes = valorParcela * (qtd - 1);
    const ultimaParcela = Math.round((total - somaAteAntes) * 100) / 100;
    const geradas = Array.from({ length: qtd }, (_, i) => ({
      id: uid(),
      descricao: "",
      valor: (i === qtd - 1 ? ultimaParcela : valorParcela).toFixed(2),
      dataVencimento: "",
      contaBancaria: "",
      dataPagamento: "",
      observacao: "",
    }));
    setParcelasPreview(geradas);
  };
  const openEdit = (b) => {
    const bLimpo = Object.fromEntries(Object.entries(b).filter(([k]) => !k.startsWith("__")));
    setEditing({ ...bLimpo, baixas: bLimpo.baixas || [] });
    setBoletoTravado(!!bLimpo.dataPagamento);
    setNovaBaixaData(new Date().toISOString().slice(0, 10));
    setNovaBaixaValor("");
    setNovaBaixaObs("");
    setPanelOpen(true);
  };

  // permite abrir um boleto específico de fora (ex: clicando num alerta de
  // boleto vencido no sino, que fica em outro componente) — assim que o id
  // chega por prop, abre o boleto pra edição e limpa, pra não abrir de novo
  useEffect(() => {
    if (!boletoParaAbrirId) return;
    const alvo = boletos.find((b) => b.id === boletoParaAbrirId);
    if (alvo) openEdit(alvo);
    if (onBoletoAberto) onBoletoAberto();
  }, [boletoParaAbrirId]);

  const addPeriodo = (isoDate, freq, n) => {
    const [y, m, d] = isoDate.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    if (freq === "semanal") dt.setDate(dt.getDate() + 7 * n);
    else if (freq === "mensal") dt.setMonth(dt.getMonth() + n);
    else if (freq === "anual") dt.setFullYear(dt.getFullYear() + n);
    return dt.toISOString().slice(0, 10);
  };

  const saveNovo = () => {
    if (!novoEmpresa.trim()) {
      alert("Preencha a empresa.");
      return;
    }
    const validas = novoParcelas.filter((p) => p.valor && p.dataVencimento);
    if (validas.length === 0) {
      alert("Preencha valor e vencimento de pelo menos um boleto.");
      return;
    }
    const novosBoletos = [];
    validas.forEach((p) => {
      const qtd = p.repetirFreq === "nenhuma" ? 1 : Math.max(1, Number(p.repetirQtd) || 1);
      for (let i = 0; i < qtd; i++) {
        novosBoletos.push({
          id: uid(),
          descricao: p.descricao || "",
          valor: p.valor,
          dataVencimento: i === 0 ? p.dataVencimento : addPeriodo(p.dataVencimento, p.repetirFreq, i),
          contaBancaria: p.contaBancaria,
          dataPagamento: i === 0 ? p.dataPagamento : "",
          observacao: p.observacao,
          codigoBarras: i === 0 ? (p.codigoBarras || "") : "",
          linhaDigitavel: i === 0 ? (p.linhaDigitavel || "") : "",
        });
      }
    });
    // mostra a previa editavel — as parcelas repetidas nem sempre têm a mesma
    // data exata ou o mesmo valor todo mês, então dá pra ajustar antes de confirmar
    setParcelasPreview(novosBoletos);
  };

  const confirmarSalvarPreview = () => {
    const semData = parcelasPreview.some((p) => !p.dataVencimento);
    if (semData) {
      alert("Preencha a data de vencimento de todas as parcelas antes de salvar.");
      return;
    }
    const totalNota = Number(novoValorNota) || 0;
    const somaParcelas = parcelasPreview.reduce((s, p) => s + (Number(p.valor) || 0), 0);
    if (totalNota > 0 && somaParcelas > totalNota + 0.01) {
      alert(`A soma das parcelas (${BRL(somaParcelas)}) está passando do valor total da nota (${BRL(totalNota)}). Ajusta os valores antes de salvar.`);
      return;
    }
    const nomeEmpresa = novoEmpresa.trim().toUpperCase();
    if (!empresasList.includes(nomeEmpresa)) {
      onAddEmpresa(nomeEmpresa);
    }
    const novosBoletos = parcelasPreview.map((p) => ({
      id: p.id,
      empresa: nomeEmpresa,
      descricao: p.descricao || "",
      notaFiscal: novoNotaFiscal.trim(),
      valor: p.valor,
      dataVencimento: p.dataVencimento,
      contaBancaria: p.contaBancaria,
      dataPagamento: p.dataPagamento,
      observacao: p.observacao,
      codigoBarras: p.codigoBarras || "",
      linhaDigitavel: p.linhaDigitavel || "",
    }));
    onSaveMultiple(novosBoletos);
    setParcelasPreview(null);
    setNovoOpen(false);
  };

  const updateParcelaPreview = (id, campo, valor) => {
    setParcelasPreview((prev) => prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)));
  };

  const removerParcelaPreview = (id) => {
    setParcelasPreview((prev) => prev.filter((p) => p.id !== id));
  };

  const save = () => {
    if (!editing.empresa || !editing.dataVencimento || !editing.valor) {
      alert("Preencha ao menos empresa, valor e data de vencimento.");
      return;
    }
    onSave(editing);
    setPanelOpen(false);
    setEditing(null);
  };

  const remove = () => {
    if (!window.confirm("Excluir este boleto?")) return;
    onDelete(editing.id);
    setPanelOpen(false);
    setEditing(null);
  };

  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>

      {gerenciarEmpresasOpen && (
        <div
          onClick={() => setGerenciarEmpresasOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(560px, 94vw)", maxHeight: "85vh", overflowY: "auto", background: "#fff", borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", padding: 22 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 20 }}>Gerenciar empresas</div>
              <button onClick={() => setGerenciarEmpresasOpen(false)} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}>×</button>
            </div>
            <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 14 }}>
              Renomear atualiza automaticamente os boletos já lançados com essa empresa (só o nome, nenhum valor muda).
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <input
                value={novaEmpresaCadastro}
                onChange={(e) => setNovaEmpresaCadastro(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && novaEmpresaCadastro.trim()) {
                    onAddEmpresa(novaEmpresaCadastro.trim());
                    setNovaEmpresaCadastro("");
                  }
                }}
                placeholder="Nome da nova empresa"
                style={{ ...inputStyle, flex: 1, textTransform: "uppercase" }}
              />
              <button
                onClick={() => {
                  if (!novaEmpresaCadastro.trim()) return;
                  onAddEmpresa(novaEmpresaCadastro.trim());
                  setNovaEmpresaCadastro("");
                }}
                style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "0 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
              >
                + Adicionar
              </button>
            </div>
            {empresas.length === 0 ? (
              <div style={{ fontSize: 13, color: "#5A6472" }}>Nenhuma empresa cadastrada ainda.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {empresas.slice().sort((a, b) => a.nome.localeCompare(b.nome)).map((e) => (
                  <div key={e.id} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", background: "#F7F8F9", borderRadius: 10, padding: 8 }}>
                    {editandoNomeEmpresaId === e.id ? (
                      <input
                        autoFocus
                        value={editandoNomeEmpresaValor}
                        onChange={(ev) => setEditandoNomeEmpresaValor(ev.target.value)}
                        onKeyDown={(ev) => {
                          if (ev.key === "Enter") { onRenameEmpresa(e.id, editandoNomeEmpresaValor); setEditandoNomeEmpresaId(null); }
                          if (ev.key === "Escape") setEditandoNomeEmpresaId(null);
                        }}
                        onBlur={() => { onRenameEmpresa(e.id, editandoNomeEmpresaValor); setEditandoNomeEmpresaId(null); }}
                        style={{ ...inputStyle, flex: 1, textTransform: "uppercase" }}
                      />
                    ) : (
                      <button
                        onClick={() => { setEditandoNomeEmpresaId(e.id); setEditandoNomeEmpresaValor(e.nome); }}
                        title="Clique pra renomear"
                        style={{ flex: 1, textAlign: "left", background: "none", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", padding: "6px 8px" }}
                      >
                        {e.nome} ✎
                      </button>
                    )}
                    <select
                      value={e.categoria || ""}
                      onChange={(ev) => onSetCategoriaEmpresa(e.id, ev.target.value)}
                      style={{ ...inputStyle, width: 200 }}
                    >
                      <option value="">Sem categoria (Outros)</option>
                      {categoriasEmpresaLista.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5A6472", width: "100%", paddingLeft: 8 }}>
                      <input
                        type="checkbox"
                        checked={e.incluirRelatorio !== false}
                        onChange={(ev) => onSetIncluirRelatorioEmpresa(e.id, ev.target.checked)}
                      />
                      Aparece no relatório de boletos a pagar (desmarque se o pagamento é feito direto com essa empresa)
                    </label>
                  </div>
                ))}
              </div>
            )}

            {(() => {
              const nomesSemCadastro = empresasList.filter((nome) => !empresas.some((e) => e.nome === nome));
              if (nomesSemCadastro.length === 0) return null;
              return (
                <>
                  <div style={{ height: 1, background: "#EEF0F2", margin: "18px 0 14px" }} />
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                    Empresas sem categoria ainda ({nomesSemCadastro.length})
                  </div>
                  <div style={{ fontSize: 11, color: "#9AA5B1", marginBottom: 10 }}>
                    Essas empresas foram digitadas direto num boleto, sem passar pelo cadastro — escolhe uma categoria pra elas aparecerem certinho.
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    {nomesSemCadastro.sort().map((nome) => (
                      <div key={nome} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", background: "#FFF6E2", borderRadius: 10, padding: 8 }}>
                        <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{nome}</div>
                        <select
                          style={{ ...inputStyle, width: 200 }}
                          value=""
                          onChange={(e) => onSetCategoriaEmpresaPorNome(nome, e.target.value)}
                        >
                          <option value="" disabled>Escolher categoria...</option>
                          {categoriasEmpresaLista.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}

            <div style={{ height: 1, background: "#EEF0F2", margin: "18px 0 14px" }} />
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Categorias</div>
            <div style={{ fontSize: 11, color: "#9AA5B1", marginBottom: 10 }}>
              Renomear atualiza automaticamente todas as empresas que já estavam nessa categoria.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
              {categoriasEmpresaLista.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", background: "#F7F8F9", borderRadius: 8, padding: 8 }}>
                  {editandoCategoriaIndice === i ? (
                    <input
                      autoFocus
                      value={editandoCategoriaValor}
                      onChange={(ev) => setEditandoCategoriaValor(ev.target.value)}
                      onKeyDown={(ev) => {
                        if (ev.key === "Enter") { onRenomearCategoriaEmpresa(i, editandoCategoriaValor); setEditandoCategoriaIndice(null); }
                        if (ev.key === "Escape") setEditandoCategoriaIndice(null);
                      }}
                      onBlur={() => { onRenomearCategoriaEmpresa(i, editandoCategoriaValor); setEditandoCategoriaIndice(null); }}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                  ) : (
                    <div
                      onClick={() => { setEditandoCategoriaIndice(i); setEditandoCategoriaValor(c); }}
                      style={{ flex: 1, cursor: "pointer", fontSize: 13 }}
                    >
                      {c}
                    </div>
                  )}
                  <button
                    onClick={() => onRemoverCategoriaEmpresa(i)}
                    title="Remover categoria"
                    style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 16 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {addingCategoria ? (
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  autoFocus
                  value={novaCategoriaNome}
                  onChange={(e) => setNovaCategoriaNome(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { onAdicionarCategoriaEmpresa(novaCategoriaNome); setNovaCategoriaNome(""); setAddingCategoria(false); }
                  }}
                  placeholder="nome da categoria"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  onClick={() => { onAdicionarCategoriaEmpresa(novaCategoriaNome); setNovaCategoriaNome(""); setAddingCategoria(false); }}
                  style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 8, padding: "0 14px", fontWeight: 700, cursor: "pointer" }}
                >
                  OK
                </button>
                <button
                  onClick={() => { setAddingCategoria(false); setNovaCategoriaNome(""); }}
                  style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 8, padding: "0 14px", cursor: "pointer" }}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingCategoria(true)}
                style={{ border: "1px dashed #B7BFC8", background: "transparent", borderRadius: 20, padding: "7px 14px", fontSize: 13, color: "#5A6472", cursor: "pointer" }}
              >
                + nova categoria
              </button>
            )}
          </div>
        </div>
      )}

      {/* filtros consolidados numa única linha: empresa, período, status, busca */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap", background: "#fff", border: "1px solid #E4E7EB", borderRadius: 12, padding: 14, marginBottom: 14 }}>
        <Field label="Empresa">
          <EmpresasChecklist
            titulo="Pesquisar empresa..."
            empresasList={empresasList}
            empresas={empresas}
            empresasSelecionadas={empresasSelecionadas}
            onToggle={onToggleEmpresaSelecionada}
            onMarcarTodas={onMarcarTodasEmpresas}
            onDesmarcarTodas={onDesmarcarTodasEmpresas}
            onResetPadrao={onResetEmpresasParaPadrao}
          />
        </Field>
        <Field label="Período">
          <PeriodoDropdown
            periodStart={periodStart}
            periodEnd={periodEnd}
            onQuickPeriod={setQuickPeriod}
            onChangeStart={setPeriodStart}
            onChangeEnd={setPeriodEnd}
          />
        </Field>
        <Field label="Status">
          <select style={inputStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="vencido">Vencido</option>
            <option value="pago">Pago</option>
          </select>
        </Field>
        <div style={{ flex: "1 1 200px" }}>
          <Field label="Buscar">
            <input
              value={listFilter}
              onChange={(e) => setListFilter(e.target.value)}
              placeholder="🔍 Buscar empresa, NF, descrição..."
              style={{ ...inputStyle, width: "100%" }}
            />
          </Field>
        </div>
        <button
          onClick={() => setGerenciarEmpresasOpen(true)}
          style={{ background: "none", border: "none", color: "#2451A6", fontSize: 12, textDecoration: "underline", cursor: "pointer", whiteSpace: "nowrap" }}
        >
          gerenciar empresas
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 20 }}>
        <button
          onClick={() => setReportOpen(true)}
          style={{ background: "#6B4423", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
        >
          Relatório de boletos
        </button>
        <button
          onClick={openNew}
          style={{ background: "#2451A6", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
        >
          + Lançar boleto
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <div onClick={() => setStatusFilter("all")} style={{ cursor: "pointer" }}>
          <MileSign label="Boletos" value={statsCards.count} tone="blue" icon="📄" />
        </div>
        <div onClick={() => setStatusFilter("pendente")} style={{ cursor: "pointer" }}>
          <MileSign label="Pendente" value={BRL(statsCards.pendente)} tone="amber" icon="📄" />
        </div>
        <div onClick={() => setStatusFilter("vencido")} style={{ cursor: "pointer" }}>
          <MileSign label="Vencido" value={BRL(statsCards.vencido)} tone="red" icon="⏰" />
        </div>
        <div onClick={() => setStatusFilter("pago")} style={{ cursor: "pointer" }}>
          <MileSign label="Pago" value={BRL(statsCards.pago)} tone="green" icon="✅" />
        </div>
      </div>

      {statusFilter !== "all" && (
        <div style={{ marginBottom: 14 }}>
          <button
            onClick={() => setStatusFilter("all")}
            style={{ fontSize: 12, color: "#5A6472", background: "#EEF0F2", border: "none", borderRadius: 10, padding: "5px 10px", cursor: "pointer" }}
          >
            Filtro: {statusFilter} — toque pra limpar ×
          </button>
        </div>
      )}

      {visibleBoletos.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 12, padding: "40px 20px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0" }}>
          Nenhum boleto encontrado nesse período/empresa. Toque em <strong>+ Lançar boleto</strong> para começar.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {visibleBoletos.map((b) => {
            const status = b.__status;
            const dataPreenchidaSemQuitar = b.__kind === "aberto" && !!b.dataPagamento && !boletoEstaQuitado(b);
            const cor = status === "pago" ? "#1F6F5C" : status === "vencido" ? "#B0402E" : "#D9A419";
            const label = status === "pago" ? "PAGO" : status === "vencido" ? "VENCIDO" : "PENDENTE";
            return (
              <div
                key={b.__key}
                onClick={() => openEdit(b)}
                style={{
                  background: "#fff", borderRadius: 12, padding: "12px 16px",
                  display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
                  cursor: "pointer", boxShadow: "0 1px 2px rgba(27,36,48,0.06)", borderLeft: `4px solid ${cor}`,
                }}
              >
                <div style={{ minWidth: 90, fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums", fontSize: 13, color: "#5A6472" }}>
                  {fmtDate(b.__dataItem)}
                  {b.__kind === "aberto" && b.novoVencimento && <div style={{ fontSize: 10, color: "#9AA5B1" }}>orig. {fmtDate(b.dataVencimento)}</div>}
                  {b.__kind === "pago" && <div style={{ fontSize: 10, color: "#9AA5B1" }}>venc. {fmtDate(vencimentoEfetivo(b))}</div>}
                </div>
                <div style={{ flex: "1 1 200px", fontSize: 14 }}>
                  <strong>{b.empresa}</strong>{b.descricao && <span style={{ color: "#5A6472" }}> — {b.descricao}</span>}
                  <div style={{ fontSize: 12, color: "#5A6472" }}>
                    NF {b.notaFiscal || "—"} · {(b.__kind === "pago" ? (b.__contaEvento || b.contaBancaria) : b.contaBancaria) || "sem conta definida"}
                    {b.codigoBarras && <span title="Código de barras salvo"> · 📷</span>}
                    {b.__kind === "pago" && b.__ehBaixaParcial && <span style={{ color: "#8A5A00", fontWeight: 700 }}> · baixa parcial</span>}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums" }}>
                  {BRL(b.__valorItem)}
                  {b.__kind === "aberto" && (b.baixas || []).length > 0 && (
                    <div style={{ fontSize: 10, fontWeight: 400, color: "#5A6472" }}>
                      de um total de {BRL(valorBaseBoleto(b))}
                    </div>
                  )}
                  {b.__kind === "aberto" && (Number(b.desconto) > 0 || Number(b.juros) > 0) && (
                    <div style={{ fontSize: 10, fontWeight: 400, color: "#5A6472" }}>
                      {Number(b.desconto) > 0 && `desc. −${BRL(Number(b.desconto))}`}
                      {Number(b.desconto) > 0 && Number(b.juros) > 0 && " · "}
                      {Number(b.juros) > 0 && `juros +${BRL(Number(b.juros))}`}
                    </div>
                  )}
                  {dataPreenchidaSemQuitar && (
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#B0402E" }}>
                      ⚠️ tem "Data de pagamento" mas ainda falta saldo
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, color: cor, background: `${cor}1A` }}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>

      {panelOpen && editing && (
        <>
          <div onClick={() => { setPanelOpen(false); setEditing(null); }} style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20 }} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(480px, 100vw)", background: "#fff", zIndex: 21, overflowY: "auto", boxShadow: "-8px 0 24px rgba(0,0,0,0.15)", padding: "24px 24px 100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 22 }}>
                {boletos.some((b) => b.id === editing.id) ? "Editar boleto" : "Novo boleto"}
              </div>
              <button onClick={() => { setPanelOpen(false); setEditing(null); }} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}>×</button>
            </div>

            {boletoTravado && (
              <div style={{ background: "#FFF6E2", border: "1px solid #D9A419", borderRadius: 12, padding: 12, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "#8A5A00" }}>
                  🔒 Esse boleto já está marcado como pago. Os campos ficam travados pra evitar alteração sem querer.
                </span>
                <button
                  onClick={() => setBoletoTravado(false)}
                  style={{ background: "#D9A419", color: "#1B2430", border: "none", borderRadius: 10, padding: "7px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  Destravar para editar
                </button>
              </div>
            )}

            {!boletoTravado && (
              <button
                onClick={() => setLeitorAberto(true)}
                style={{ background: "#2451A6", color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: editing.codigoBarras ? 8 : 16, width: "100%" }}
              >
                📷 {editing.codigoBarras ? "Ler de novo" : "Ler código de barras"}
              </button>
            )}

            {(editing.linhaDigitavel || editing.codigoBarras) && (
              <div style={{ background: "#F7F8F9", border: "1px solid #E4E7EB", borderRadius: 10, padding: 10, marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#5A6472", marginBottom: 4 }}>
                  {editing.linhaDigitavel ? "Linha digitável (cola no app do banco pra pagar)" : "Código de barras (formato de convênio/concessionária)"}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums", fontSize: 13, wordBreak: "break-all" }}>
                    {editing.linhaDigitavel || editing.codigoBarras}
                  </div>
                  <button
                    onClick={() => {
                      const texto = editing.linhaDigitavel || editing.codigoBarras;
                      navigator.clipboard.writeText(texto).then(
                        () => alert("Copiado!"),
                        () => alert("Não consegui copiar automaticamente — seleciona o número na tela e copia manualmente.")
                      );
                    }}
                    style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}

            {leitorAberto && (
              <LeitorCodigoBarras
                onFechar={() => setLeitorAberto(false)}
                onDetectado={(codigo) => {
                  setLeitorAberto(false);
                  const decodificado = decodificarCodigoBarrasBoleto(codigo);
                  if (!decodificado) {
                    setEditing((prev) => ({ ...prev, codigoBarras: codigo }));
                    alert("Código lido, mas não consegui identificar o valor/vencimento automaticamente (deve ser boleto de concessionária/convênio). O código foi guardado — preenche o valor e vencimento na mão, por favor.");
                    return;
                  }
                  setEditing((prev) => ({ ...prev, valor: decodificado.valor, dataVencimento: decodificado.dataVencimento, codigoBarras: decodificado.codigoBarras, linhaDigitavel: decodificado.linhaDigitavel }));
                }}
              />
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12, marginBottom: 20 }}>
              <Field label="Empresa">
                <select disabled={boletoTravado} style={inputStyle} value={editing.empresa} onChange={(e) => setEditing({ ...editing, empresa: e.target.value })}>
                  <option value={editing.empresa}>{editing.empresa || "Selecione"}</option>
                  {empresasList.filter((nome) => nome !== editing.empresa).map((nome) => <option key={nome} value={nome}>{nome}</option>)}
                </select>
              </Field>
              <Field label="Nota Fiscal">
                <input disabled={boletoTravado} style={inputStyle} value={editing.notaFiscal} onChange={(e) => setEditing({ ...editing, notaFiscal: e.target.value })} />
              </Field>
              <Field label="Descrição">
                <input disabled={boletoTravado} style={inputStyle} value={editing.descricao} onChange={(e) => setEditing({ ...editing, descricao: e.target.value })} placeholder="ex: Odontoprev, Seguro de vida" />
              </Field>
              <Field label="Valor (R$)">
                <input disabled={boletoTravado} type="number" style={inputStyle} value={editing.valor} onChange={(e) => setEditing({ ...editing, valor: e.target.value })} />
              </Field>
              <Field label="Data de vencimento">
                <input disabled={boletoTravado} type="date" style={inputStyle} value={editing.dataVencimento} onChange={(e) => setEditing({ ...editing, dataVencimento: e.target.value })} onBlur={(e) => setEditing({ ...editing, dataVencimento: corrigirAnoDigitado(e.target.value) })} />
              </Field>
              <Field label="Data de pagamento (quitação total)">
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input disabled={boletoTravado} type="date" style={{ ...inputStyle, flex: 1 }} value={editing.dataPagamento} onChange={(e) => setEditing({ ...editing, dataPagamento: e.target.value })} onBlur={(e) => setEditing({ ...editing, dataPagamento: corrigirAnoDigitado(e.target.value) })} />
                  {!boletoTravado && editing.dataPagamento && (
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, dataPagamento: "" })}
                      style={{ background: "#EEF0F2", color: "#5A6472", border: "none", borderRadius: 8, padding: "10px 12px", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      Limpar
                    </button>
                  )}
                </div>
                {editing.dataPagamento && !boletoEstaQuitado(editing) && (
                  <div style={{ fontSize: 11, color: "#B0402E", marginTop: 4, fontWeight: 700 }}>
                    ⚠️ ainda sobra saldo de {BRL(saldoRestanteBoleto(editing))} (veja "Novo vencimento" abaixo) —
                    esse boleto vai continuar contando como não quitado até esse saldo zerar. Se essa data é
                    só de uma baixa parcial, deixe esse campo em branco e registre o valor em "Baixas parciais" abaixo.
                  </div>
                )}
              </Field>
              <Field label="Novo vencimento (opcional, se renegociar saldo)">
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input disabled={boletoTravado} type="date" style={{ ...inputStyle, flex: 1 }} value={editing.novoVencimento || ""} onChange={(e) => setEditing({ ...editing, novoVencimento: e.target.value })} onBlur={(e) => setEditing({ ...editing, novoVencimento: corrigirAnoDigitado(e.target.value) })} />
                  {!boletoTravado && editing.novoVencimento && (
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, novoVencimento: "" })}
                      style={{ background: "#EEF0F2", color: "#5A6472", border: "none", borderRadius: 8, padding: "10px 12px", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </Field>
              <Field label="Desconto (R$)">
                <input disabled={boletoTravado} type="number" style={inputStyle} value={editing.desconto} onChange={(e) => setEditing({ ...editing, desconto: e.target.value })} placeholder="0,00" />
              </Field>
              <Field label="Descrição do desconto">
                <input disabled={boletoTravado} style={inputStyle} value={editing.descontoDescricao} onChange={(e) => setEditing({ ...editing, descontoDescricao: e.target.value })} placeholder="ex: pagamento antecipado" />
              </Field>
              <Field label="Juros (R$)">
                <input disabled={boletoTravado} type="number" style={inputStyle} value={editing.juros} onChange={(e) => setEditing({ ...editing, juros: e.target.value })} placeholder="0,00" />
              </Field>
              <Field label="Observação">
                <input disabled={boletoTravado} style={inputStyle} value={editing.observacao} onChange={(e) => setEditing({ ...editing, observacao: e.target.value })} />
              </Field>
            </div>

            {(Number(editing.desconto) > 0 || Number(editing.juros) > 0) && (
              <div style={{ background: "#F7F8F9", borderRadius: 12, padding: 10, marginBottom: 16, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Valor original</span>
                  <span>{BRL(Number(editing.valor) || 0)}</span>
                </div>
                {Number(editing.desconto) > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#12503F" }}>
                    <span>Desconto{editing.descontoDescricao && ` (${editing.descontoDescricao})`}</span>
                    <span>−{BRL(Number(editing.desconto))}</span>
                  </div>
                )}
                {Number(editing.juros) > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#B0402E" }}>
                    <span>Juros</span>
                    <span>+{BRL(Number(editing.juros))}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, borderTop: "1px solid #D7DBE0", marginTop: 4, paddingTop: 4 }}>
                  <span>Valor final pago</span>
                  <span>{BRL((Number(editing.valor) || 0) - (Number(editing.desconto) || 0) + (Number(editing.juros) || 0))}</span>
                </div>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#5A6472", textTransform: "uppercase", marginBottom: 8 }}>
                Baixas parciais (pagamento parcial, vale de funcionário fixo etc.) — cada uma conta como paga na sua própria data
              </div>
              {(editing.baixas || []).length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                  {editing.baixas.map((bx) => (
                    <div key={bx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F7F8F9", borderRadius: 10, padding: "6px 10px", fontSize: 12 }}>
                      <span>
                        {fmtDate(bx.data)} {bx.observacao && `— ${bx.observacao}`}
                        {bx.contaBancaria && <span style={{ color: "#5A6472" }}> · {bx.contaBancaria}</span>}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <strong>{BRL(Number(bx.valor) || 0)}</strong>
                        {!boletoTravado && (
                          <button
                            onClick={() => setEditing({ ...editing, baixas: editing.baixas.filter((x) => x.id !== bx.id) })}
                            style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 13 }}
                          >
                            ×
                          </button>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {!boletoTravado && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <Field label="Data">
                    <input type="date" style={inputStyle} value={novaBaixaData} onChange={(e) => setNovaBaixaData(e.target.value)} onBlur={(e) => setNovaBaixaData(corrigirAnoDigitado(e.target.value))} />
                  </Field>
                  <Field label="Valor (R$)">
                    <input type="number" style={{ ...inputStyle, width: 100 }} value={novaBaixaValor} onChange={(e) => setNovaBaixaValor(e.target.value)} />
                  </Field>
                  <Field label="Conta bancária">
                    <select
                      style={{ ...inputStyle, width: 150 }}
                      value={novaBaixaConta}
                      onChange={(e) => {
                        if (e.target.value === "__nova__") {
                          const nome = window.prompt("Nome da nova conta bancária:");
                          if (nome && nome.trim()) {
                            onAddConta(nome.trim());
                            setNovaBaixaConta(nome.trim());
                          }
                        } else {
                          setNovaBaixaConta(e.target.value);
                        }
                      }}
                    >
                      <option value="">Selecione</option>
                      {contasList.map((c) => <option key={c} value={c}>{c}</option>)}
                      <option value="__nova__">+ nova conta...</option>
                    </select>
                  </Field>
                  <Field label="Observação">
                    <input style={{ ...inputStyle, width: 160 }} value={novaBaixaObs} onChange={(e) => setNovaBaixaObs(e.target.value)} placeholder="ex: Vale" />
                  </Field>
                  <button
                    onClick={() => {
                      if (!novaBaixaValor || Number(novaBaixaValor) <= 0) return;
                      setEditing({
                        ...editing,
                        baixas: [...(editing.baixas || []), { id: uid(), data: novaBaixaData, valor: novaBaixaValor, observacao: novaBaixaObs.trim(), contaBancaria: novaBaixaConta }],
                      });
                      setNovaBaixaValor("");
                      setNovaBaixaObs("");
                      setNovaBaixaConta("");
                    }}
                    style={{ background: "#8A5A00", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                  >
                    Adicionar baixa
                  </button>
                </div>
              )}
              {(editing.baixas || []).length > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, marginTop: 10, background: boletoEstaQuitado(editing) ? "#1F6F5C" : "#1B2430", color: "#fff", borderRadius: 10, padding: "8px 12px" }}>
                  <span>
                    {saldoRestanteBoleto(editing) <= 0.009
                      ? "✓ Quitado com as baixas"
                      : boletoEstaQuitado(editing)
                      ? "✓ Saldo coberto pela quitação total"
                      : "Saldo restante"}
                  </span>
                  <span>{BRL(saldoRestanteBoleto(editing))}</span>
                </div>
              )}
            </div>

            <Field label="Conta bancária usada">
              <select
                disabled={boletoTravado}
                style={{ ...inputStyle, marginBottom: 24 }}
                value={editing.contaBancaria}
                onChange={(e) => {
                  if (e.target.value === "__nova__") {
                    const nome = window.prompt("Nome da nova conta bancária:");
                    if (nome && nome.trim()) {
                      onAddConta(nome.trim());
                      setEditing({ ...editing, contaBancaria: nome.trim() });
                    }
                  } else {
                    setEditing({ ...editing, contaBancaria: e.target.value });
                  }
                }}
              >
                <option value="">Selecione</option>
                {contasList.map((c) => <option key={c} value={c}>{c}</option>)}
                <option value="__nova__">+ nova conta...</option>
              </select>
            </Field>

            <div style={{ display: "flex", gap: 10 }}>
              <button disabled={boletoTravado} onClick={save} style={{ flex: 1, background: boletoTravado ? "#EEF0F2" : "#D9A419", color: boletoTravado ? "#9AA5B1" : "#1B2430", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, cursor: boletoTravado ? "not-allowed" : "pointer" }}>
                Salvar boleto
              </button>
              {boletos.some((b) => b.id === editing.id) && (
                <button disabled={boletoTravado} onClick={remove} style={{ background: boletoTravado ? "#EEF0F2" : "#FBEBE8", color: boletoTravado ? "#9AA5B1" : "#B0402E", border: boletoTravado ? "1px solid #D7DBE0" : "1px solid #B0402E33", borderRadius: 10, padding: "12px 16px", fontWeight: 700, cursor: boletoTravado ? "not-allowed" : "pointer" }}>
                  Excluir
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {novoOpen && (
        <>
          <div onClick={() => setNovoOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20 }} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(560px, 100vw)", background: "#fff", zIndex: 21, overflowY: "auto", boxShadow: "-8px 0 24px rgba(0,0,0,0.15)", padding: "24px 24px 100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 22 }}>Novo lançamento</div>
              <button onClick={() => setNovoOpen(false)} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}>×</button>
            </div>

            {leitorParcelaId && (
              <LeitorCodigoBarras
                onFechar={() => setLeitorParcelaId(null)}
                onDetectado={(codigo) => {
                  const idAlvo = leitorParcelaId;
                  setLeitorParcelaId(null);
                  const decodificado = decodificarCodigoBarrasBoleto(codigo);
                  setNovoParcelas((prev) => prev.map((p) => {
                    if (p.id !== idAlvo) return p;
                    if (!decodificado) {
                      alert("Código lido, mas não consegui identificar o valor/vencimento automaticamente (deve ser boleto de concessionária/convênio). O código foi guardado — preenche o valor e vencimento na mão, por favor.");
                      return { ...p, codigoBarras: codigo };
                    }
                    return { ...p, valor: decodificado.valor, dataVencimento: decodificado.dataVencimento, codigoBarras: decodificado.codigoBarras, linhaDigitavel: decodificado.linhaDigitavel };
                  }));
                }}
              />
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12, marginBottom: 12 }}>
              <Field label="Empresa">
                {novoEmpresaCustom ? (
                  <input
                    style={inputStyle}
                    value={novoEmpresa}
                    onChange={(e) => setNovoEmpresa(e.target.value)}
                    placeholder="nome da nova empresa"
                    autoFocus
                  />
                ) : (
                  <select
                    style={inputStyle}
                    value={empresasList.includes(novoEmpresa) ? novoEmpresa : ""}
                    onChange={(e) => {
                      if (e.target.value === "__nova__") {
                        setNovoEmpresaCustom(true);
                        setNovoEmpresa("");
                      } else {
                        setNovoEmpresa(e.target.value);
                      }
                    }}
                  >
                    <option value="">Selecione</option>
                    {empresasList.map((nome) => <option key={nome} value={nome}>{nome}</option>)}
                    <option value="__nova__">+ nova empresa...</option>
                  </select>
                )}
              </Field>
              <Field label="Nota Fiscal">
                <input style={inputStyle} value={novoNotaFiscal} onChange={(e) => setNovoNotaFiscal(e.target.value)} placeholder="pode ficar em branco" />
              </Field>
            </div>
            {novoEmpresaCustom && (
              <button
                onClick={() => { setNovoEmpresaCustom(false); setNovoEmpresa(""); }}
                style={{ fontSize: 12, color: "#5A6472", background: "none", border: "none", cursor: "pointer", marginBottom: 12, padding: 0, textDecoration: "underline" }}
              >
                usar empresa já cadastrada
              </button>
            )}

            {parcelasPreview === null && (
              <>
                <div style={{ background: "#EEF0FF", border: "1px solid #C7CFFA", borderRadius: 12, padding: 14, marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 6, color: "#2E3A8C" }}>
                    Dividir o valor total em parcelas iguais
                  </div>
                  <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 8 }}>
                    Preenche o valor total da nota, quantas parcelas quer, e o app já calcula o valor de cada uma (com o resto do arredondamento ficando na última). Depois você ajusta a data — e o valor, se precisar — de cada parcela.
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
                    <Field label="Valor total da nota (R$)">
                      <input type="number" style={inputStyle} value={novoValorNota} onChange={(e) => setNovoValorNota(e.target.value)} />
                    </Field>
                    <Field label="Dividir em quantas parcelas">
                      <input type="number" min="1" style={{ ...inputStyle, width: 90 }} value={novoQtdDividir} onChange={(e) => setNovoQtdDividir(e.target.value)} />
                    </Field>
                    <button
                      onClick={dividirEmParcelas}
                      style={{ background: "#2E3A8C", color: "#fff", border: "none", borderRadius: 10, padding: "9px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                    >
                      Dividir
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 12 }}>
                  Ou, se preferir, lança cada boleto manualmente abaixo (útil quando os valores já são diferentes de propósito):
                </div>

                <RepeatingSection
                  title="Boletos dessa nota"
                  items={novoParcelas}
                  onAdd={() => setNovoParcelas([...novoParcelas, emptyParcela()])}
                  onRemove={(id) => setNovoParcelas(novoParcelas.filter((p) => p.id !== id))}
                  onUpdate={(id, updated) => setNovoParcelas(novoParcelas.map((p) => (p.id === id ? updated : p)))}
                  addLabel="+ adicionar boleto"
                  renderItem={(item, update) => (
                    <>
                      <div style={{ gridColumn: "1 / -1", marginBottom: 4 }}>
                        <button
                          onClick={() => setLeitorParcelaId(item.id)}
                          style={{ background: "#2451A6", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                        >
                          📷 Ler código de barras
                        </button>
                      </div>
                      <Field label="Descrição">
                        <input style={inputStyle} value={item.descricao} onChange={(e) => update({ ...item, descricao: e.target.value })} placeholder="ex: Odontoprev, Seguro de vida" />
                      </Field>
                      <Field label="Valor (R$)">
                        <input type="number" style={inputStyle} value={item.valor} onChange={(e) => update({ ...item, valor: e.target.value })} />
                  </Field>
                  <Field label="Vencimento">
                    <input type="date" style={inputStyle} value={item.dataVencimento} onChange={(e) => update({ ...item, dataVencimento: e.target.value })} onBlur={(e) => update({ ...item, dataVencimento: corrigirAnoDigitado(e.target.value) })} />
                  </Field>
                  <Field label="Conta bancária">
                    <select
                      style={inputStyle}
                      value={item.contaBancaria}
                      onChange={(e) => {
                        if (e.target.value === "__nova__") {
                          const nome = window.prompt("Nome da nova conta bancária:");
                          if (nome && nome.trim()) {
                            onAddConta(nome.trim());
                            update({ ...item, contaBancaria: nome.trim() });
                          }
                        } else {
                          update({ ...item, contaBancaria: e.target.value });
                        }
                      }}
                    >
                      <option value="">Selecione</option>
                      {contasList.map((c) => <option key={c} value={c}>{c}</option>)}
                      <option value="__nova__">+ nova conta...</option>
                    </select>
                  </Field>
                  <Field label="Data pagamento (baixa)">
                    <input type="date" style={inputStyle} value={item.dataPagamento} onChange={(e) => update({ ...item, dataPagamento: e.target.value })} onBlur={(e) => update({ ...item, dataPagamento: corrigirAnoDigitado(e.target.value) })} />
                  </Field>
                  <Field label="Observação">
                    <input style={inputStyle} value={item.observacao} onChange={(e) => update({ ...item, observacao: e.target.value })} />
                  </Field>
                  <Field label="Repetir">
                    <select style={inputStyle} value={item.repetirFreq} onChange={(e) => update({ ...item, repetirFreq: e.target.value })}>
                      <option value="nenhuma">Não repetir</option>
                      <option value="semanal">Semanalmente</option>
                      <option value="mensal">Mensalmente</option>
                      <option value="anual">Anualmente</option>
                    </select>
                  </Field>
                  {item.repetirFreq !== "nenhuma" && (
                    <Field label="Quantas vezes">
                      <input type="number" min="1" style={inputStyle} value={item.repetirQtd} onChange={(e) => update({ ...item, repetirQtd: e.target.value })} />
                    </Field>
                  )}
                    </>
                  )}
                />

                <button
                  onClick={saveNovo}
                  style={{ width: "100%", background: "#D9A419", color: "#1B2430", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, cursor: "pointer", marginTop: 10 }}
                >
                  Gerar parcelas / Revisar
                </button>
              </>
            )}

            {parcelasPreview !== null && (() => {
              const totalNota = Number(novoValorNota) || 0;
              const somaParcelas = parcelasPreview.reduce((s, p) => s + (Number(p.valor) || 0), 0);
              const passouDoValor = totalNota > 0 && somaParcelas > totalNota + 0.01;
              return (
                <>
                  <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 12 }}>
                    Confere e ajusta a data (e o valor, se precisar) de cada parcela antes de salvar.
                  </div>

                  {parcelasPreview.map((p, i) => (
                    <div key={p.id} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end", background: "#F7F8F9", borderRadius: 12, padding: 10, marginBottom: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#5A6472", minWidth: 70 }}>Parcela {i + 1}</div>
                      <Field label="Valor (R$)">
                        <input type="number" style={{ ...inputStyle, width: 110 }} value={p.valor} onChange={(e) => updateParcelaPreview(p.id, "valor", e.target.value)} />
                      </Field>
                      <Field label="Vencimento">
                        <input type="date" style={inputStyle} value={p.dataVencimento} onChange={(e) => updateParcelaPreview(p.id, "dataVencimento", e.target.value)} onBlur={(e) => updateParcelaPreview(p.id, "dataVencimento", corrigirAnoDigitado(e.target.value))} />
                      </Field>
                      <Field label="Descrição">
                        <input style={{ ...inputStyle, width: 140 }} value={p.descricao} onChange={(e) => updateParcelaPreview(p.id, "descricao", e.target.value)} />
                      </Field>
                      <Field label="Conta bancária">
                        <select
                          style={inputStyle}
                          value={p.contaBancaria}
                          onChange={(e) => {
                            if (e.target.value === "__nova__") {
                              const nome = window.prompt("Nome da nova conta bancária:");
                              if (nome && nome.trim()) {
                                onAddConta(nome.trim());
                                updateParcelaPreview(p.id, "contaBancaria", nome.trim());
                              }
                            } else {
                              updateParcelaPreview(p.id, "contaBancaria", e.target.value);
                            }
                          }}
                        >
                          <option value="">Selecione</option>
                          {contasList.map((c) => <option key={c} value={c}>{c}</option>)}
                          <option value="__nova__">+ nova conta...</option>
                        </select>
                      </Field>
                      <button onClick={() => removerParcelaPreview(p.id)} style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 18, marginBottom: 8 }}>×</button>
                    </div>
                  ))}

                  <div style={{ background: passouDoValor ? "#FBEBE8" : "#F7F8F9", border: passouDoValor ? "1px solid #B0402E" : "1px solid #EEF0F2", borderRadius: 12, padding: 10, marginTop: 8, marginBottom: 12, fontSize: 13 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Soma das parcelas</span>
                      <strong style={{ color: passouDoValor ? "#B0402E" : "#1B2430" }}>{BRL(somaParcelas)}</strong>
                    </div>
                    {totalNota > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#5A6472" }}>
                        <span>Valor total da nota</span>
                        <span>{BRL(totalNota)}</span>
                      </div>
                    )}
                    {passouDoValor && (
                      <div style={{ color: "#B0402E", fontWeight: 700, marginTop: 4 }}>
                        A soma está passando do valor da nota — ajusta antes de salvar.
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={confirmarSalvarPreview}
                      style={{ flex: 1, background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, cursor: "pointer" }}
                    >
                      Confirmar e salvar
                    </button>
                    <button
                      onClick={() => setParcelasPreview(null)}
                      style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 10, padding: "12px 16px", cursor: "pointer" }}
                    >
                      Voltar
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </>
      )}

      {reportOpen && (
        <div
          onClick={() => setReportOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-relatorio" style={{ width: "min(760px, 94vw)", maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: 14, zIndex: 21, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", padding: 24 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 22 }}>Relatório de boletos</div>
              <button onClick={() => setReportOpen(false)} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              <button onClick={() => setQuickPeriod("hoje")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 10, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Hoje</button>
              <button onClick={() => setQuickPeriod("semana")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 10, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Esta semana</button>
              <button onClick={() => setQuickPeriod("mes")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 10, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Este mês</button>
              <button onClick={() => setQuickPeriod("tudo")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 10, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Tudo</button>
            </div>

            <div className="filtros-relatorio" style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap" }}>
              <Field label="De">
                <input type="date" style={inputStyle} value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} onBlur={(e) => setPeriodStart(corrigirAnoDigitado(e.target.value))} />
              </Field>
              <Field label="Até">
                <input type="date" style={inputStyle} value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} onBlur={(e) => setPeriodEnd(corrigirAnoDigitado(e.target.value))} />
              </Field>
              <Field label="Status">
                <select style={inputStyle} value={statusReportFilter} onChange={(e) => setStatusReportFilter(e.target.value)}>
                  <option value="all">Todos</option>
                  <option value="aberto">Em aberto (pendente + vencido)</option>
                  <option value="pendente">Pendente</option>
                  <option value="vencido">Vencido</option>
                  <option value="pago">Pago</option>
                </select>
              </Field>
              <button onClick={exportCSV} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Baixar CSV
              </button>
              <button onClick={() => window.print()} style={{ background: "#6B4423", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Baixar PDF
              </button>
            </div>

            {report.items.length === 0 ? (
              <div style={{ padding: "30px 10px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 12 }}>
                Nenhum boleto nesse período.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#1B2430" }}>
                      {[
                        { h: "Empresa", align: "left" },
                        { h: "Descrição", align: "left" },
                        { h: "NF", align: "left" },
                        { h: "Vencimento", align: "center" },
                        { h: "Conta", align: "left" },
                        { h: "Pago em", align: "center" },
                        { h: "Status", align: "center" },
                        { h: "Valor", align: "right" },
                      ].map((c) => (
                        <th key={c.h} style={{ textAlign: c.align, padding: "9px 10px", color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14 }}>{c.h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.items.map((b, i) => {
                      const status = b.__kind === "pago" ? (b.__ehBaixaParcial ? "Pago (baixa)" : "Pago") : b.__status === "vencido" ? "Vencido" : "Pendente";
                      const corStatus = b.__kind === "pago" ? "#12503F" : b.__status === "vencido" ? "#B0402E" : "#8A5A00";
                      return (
                        <tr key={b.__key} style={{ borderBottom: "1px solid #EEF0F2", background: i % 2 === 0 ? "#fff" : "#F7F8F9" }}>
                          <td style={{ padding: "8px 10px", textAlign: "left" }}>{b.empresa}</td>
                          <td style={{ padding: "8px 10px", textAlign: "left" }}>{b.descricao}</td>
                          <td style={{ padding: "8px 10px", textAlign: "left" }}>{b.notaFiscal}</td>
                          <td style={{ padding: "8px 10px", textAlign: "center" }}>{fmtDate(vencimentoEfetivo(b))}</td>
                          <td style={{ padding: "8px 10px", textAlign: "left" }}>{b.__kind === "pago" ? (b.__contaEvento || b.contaBancaria) : b.contaBancaria}</td>
                          <td style={{ padding: "8px 10px", textAlign: "center" }}>{b.__kind === "pago" ? fmtDate(b.__dataItem) : "—"}</td>
                          <td style={{ padding: "8px 10px", textAlign: "center", color: corStatus, fontWeight: 700 }}>{status}</td>
                          <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700 }}>{BRL(b.__valorItem)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    {(statusReportFilter === "all" || statusReportFilter === "aberto" || statusReportFilter === "pendente") && (
                      <tr><td colSpan={7} style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: "#8A5A00" }}>Pendente:</td><td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: "#8A5A00" }}>{BRL(report.totals.pendente)}</td></tr>
                    )}
                    {(statusReportFilter === "all" || statusReportFilter === "aberto" || statusReportFilter === "vencido") && (
                      <tr><td colSpan={7} style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>Vencido:</td><td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>{BRL(report.totals.vencido)}</td></tr>
                    )}
                    {(statusReportFilter === "all" || statusReportFilter === "pago") && (
                      <tr><td colSpan={7} style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: "#12503F" }}>Pago:</td><td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: "#12503F" }}>{BRL(report.totals.pago)}</td></tr>
                    )}
                    <tr style={{ background: "#1B2430" }}>
                      <td colSpan={7} style={{ padding: "10px", fontWeight: 700, textAlign: "right", color: "#fff" }}>TOTAL:</td>
                      <td style={{ padding: "10px", textAlign: "right", fontWeight: 700, color: "#fff" }}>
                        {BRL(
                          statusReportFilter === "all"
                            ? report.totals.total
                            : statusReportFilter === "aberto"
                            ? report.totals.pendente + report.totals.vencido
                            : statusReportFilter === "pendente"
                            ? report.totals.pendente
                            : statusReportFilter === "vencido"
                            ? report.totals.vencido
                            : report.totals.pago
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("viagens"); // viagens | boletos
  const [trucks, setTrucks] = useState([]);
  const [trips, setTrips] = useState([]);
  const [vales, setVales] = useState([]);
  const [boletos, setBoletos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [fechamentos, setFechamentos] = useState([]);
  const [despesasVeiculo, setDespesasVeiculo] = useState([]);
  const [taxasPool, setTaxasPool] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [contas, setContas] = useState([]);
  const [trocasOleo, setTrocasOleo] = useState([]);
  const [servicosVeiculo, setServicosVeiculo] = useState([]);
  const [semParar, setSemParar] = useState([]);
  const [seguro, setSeguro] = useState([]);
  const [semPararOutros, setSemPararOutros] = useState([]);
  const [config, setConfig] = useState([]);
  const senhaAppSalva = (config.find((c) => c.chave === "senhaApp") || {}).valor || "";
  const [configOpen, setConfigOpen] = useState(false);
  const [configSecaoAberta, setConfigSecaoAberta] = useState("geral"); // geral | seguradoras | caminhoes
  const [caminhaoExpandidoId, setCaminhaoExpandidoId] = useState(null);
  const [enviandoDocId, setEnviandoDocId] = useState(null);

  // sobe o documento anual pro Google Drive (funciona pra foto ou PDF, sem
  // limite de tamanho de célula) e guarda só o link no lugar do arquivo
  const anexarDocumentoAnual = async (tr, ano, file) => {
    setEnviandoDocId(tr.id);
    try {
      const resultado = await uploadArquivoParaDrive(file, tokenRef.current, `${tr.placa} - CRLV ${ano}`);
      updateTruckInfo(tr.id, { documentosPorAno: { ...(tr.documentosPorAno || {}), [ano]: resultado.webViewLink } });
    } catch (e) {
      alert("Não consegui enviar o arquivo pro Google Drive. Confere sua internet e tenta de novo.\n\n" + e.message);
    } finally {
      setEnviandoDocId(null);
    }
  };
  const [configPercentualEdit, setConfigPercentualEdit] = useState("");
  const [categoriasEmpresaLista, setCategoriasEmpresaLista] = useState([...CATEGORIAS_EMPRESA]);
  // empresas que a pessoa NÃO quer que apareçam no alerta de boleto vencido
  // (ex: uma empresa que ela paga direto, sem passar pelo sistema) — por
  // padrão nenhuma é excluída, ou seja, alerta pra todas
  const [empresasExcluidasAlertaVencido, setEmpresasExcluidasAlertaVencido] = useState([]);
  const [categoriasIncluidasDashboardGeral, setCategoriasIncluidasDashboardGeral] = useState([]);
  // preço combinado (por litro) de diesel/arla em cada posto — cadastrado em
  // Configurações, usado pra avisar quando um abastecimento é lançado com
  // preço diferente do combinado
  const [precosPostos, setPrecosPostos] = useState([]);
  const [novoPostoPrecoNome, setNovoPostoPrecoNome] = useState("");
  const salvarPrecosPostos = (novaLista) => {
    setPrecosPostos(novaLista);
    const nextConfig = [...config.filter((c) => c.chave !== "precosPostos"), { chave: "precosPostos", valor: JSON.stringify(novaLista) }];
    setConfig(nextConfig);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, seguro, semPararOutros, nextConfig);
  };
  const addPrecoPosto = (posto) => {
    const nome = posto.trim();
    if (!nome) return;
    if (precosPostos.some((p) => p.posto.toUpperCase() === nome.toUpperCase())) return;
    salvarPrecosPostos([...precosPostos, { id: uid(), posto: nome, precoDiesel: "", precoArla: "" }]);
  };
  const updatePrecoPosto = (id, campo, valor) => {
    salvarPrecosPostos(precosPostos.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)));
  };
  const removePrecoPosto = (id) => {
    salvarPrecosPostos(precosPostos.filter((p) => p.id !== id));
  };
  const [dashboardGeralSecaoAberta, setDashboardGeralSecaoAberta] = useState(null); // null | 'receita' | 'comissoes' | 'gastos' | 'boletos' | 'taxa'
  const [dashboardGeralOrdenacao, setDashboardGeralOrdenacao] = useState("data"); // data | motorista
  const [dashboardGeralOrdenacaoBoletos, setDashboardGeralOrdenacaoBoletos] = useState("data"); // data | empresa
  const [dashboardGeralPeriodStart, setDashboardGeralPeriodStart] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
  });
  const [dashboardGeralPeriodEnd, setDashboardGeralPeriodEnd] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10);
  });
  const setDashboardGeralQuickPeriod = (kind) => {
    const d = new Date();
    if (kind === "hoje") {
      const iso = d.toISOString().slice(0, 10);
      setDashboardGeralPeriodStart(iso);
      setDashboardGeralPeriodEnd(iso);
    } else if (kind === "semana") {
      const dia = d.getDay();
      const inicio = new Date(d); inicio.setDate(d.getDate() - dia);
      const fim = new Date(d); fim.setDate(d.getDate() + (6 - dia));
      setDashboardGeralPeriodStart(inicio.toISOString().slice(0, 10));
      setDashboardGeralPeriodEnd(fim.toISOString().slice(0, 10));
    } else if (kind === "mes") {
      setDashboardGeralPeriodStart(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10));
      setDashboardGeralPeriodEnd(new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10));
    } else if (kind === "tudo") {
      setDashboardGeralPeriodStart("2000-01-01");
      setDashboardGeralPeriodEnd("2100-01-01");
    }
  };
  const [configIntervaloOleoEdit, setConfigIntervaloOleoEdit] = useState("");
  const [configRegrasVencimentoEdit, setConfigRegrasVencimentoEdit] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // truckLabel precisa vir cedo: varios useMemo abaixo dependem dela
  const truckLabel = (id) => trucks.find((t) => t.id === id)?.placa || "—";

  const [filterTruck, setFilterTruck] = useState("all");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tripTravada, setTripTravada] = useState(false);
  const [newPlate, setNewPlate] = useState("");
  const [addingTruck, setAddingTruck] = useState(false);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [reportOpen, setReportOpen] = useState(false);
  const [reportView, setReportView] = useState("resumo"); // resumo | detalhado
  const [reportMonth, setReportMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [dashboardPeriodStart, setDashboardPeriodStart] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
  });
  const [dashboardPeriodEnd, setDashboardPeriodEnd] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10);
  });
  const setDashboardQuickPeriod = (kind) => {
    const d = new Date();
    if (kind === "hoje") {
      const iso = d.toISOString().slice(0, 10);
      setDashboardPeriodStart(iso);
      setDashboardPeriodEnd(iso);
    } else if (kind === "semana") {
      const dia = d.getDay();
      const inicio = new Date(d); inicio.setDate(d.getDate() - dia);
      const fim = new Date(d); fim.setDate(d.getDate() + (6 - dia));
      setDashboardPeriodStart(inicio.toISOString().slice(0, 10));
      setDashboardPeriodEnd(fim.toISOString().slice(0, 10));
    } else if (kind === "mes") {
      setDashboardPeriodStart(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10));
      setDashboardPeriodEnd(new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10));
    } else if (kind === "tudo") {
      setDashboardPeriodStart("2000-01-01");
      setDashboardPeriodEnd("2100-01-01");
    }
  };

  const todayISO = () => new Date().toISOString().slice(0, 10);
  const [relatorioRecebimentoOpen, setRelatorioRecebimentoOpen] = useState(false);
  const [relatoriosMenuAberto, setRelatoriosMenuAberto] = useState(false);
  const [dashboardMenuAberto, setDashboardMenuAberto] = useState(false);
  const [boletoParaAbrirId, setBoletoParaAbrirId] = useState(null);
  const [senhaAppDesbloqueada, setSenhaAppDesbloqueada] = useState(false);
  const [senhaAppDigitada, setSenhaAppDigitada] = useState("");
  const [erroSenhaApp, setErroSenhaApp] = useState("");
  const [configSenhaAppNovaEdit, setConfigSenhaAppNovaEdit] = useState("");
  const [relatorioGastosOpen, setRelatorioGastosOpen] = useState(false);
  const [relatorioConsumoOpen, setRelatorioConsumoOpen] = useState(false);
  const [relatorioServicosOpen, setRelatorioServicosOpen] = useState(false);
  const [servicosEmpresaFiltro, setServicosEmpresaFiltro] = useState("all");
  const [servicosPeriodStart, setServicosPeriodStart] = useState("2000-01-01");
  const [servicosPeriodEnd, setServicosPeriodEnd] = useState("2100-01-01");
  const setServicosQuickPeriod = (kind) => {
    const d = new Date();
    if (kind === "hoje") {
      const iso = d.toISOString().slice(0, 10);
      setServicosPeriodStart(iso);
      setServicosPeriodEnd(iso);
    } else if (kind === "semana") {
      const dia = d.getDay();
      const inicio = new Date(d); inicio.setDate(d.getDate() - dia);
      const fim = new Date(d); fim.setDate(d.getDate() + (6 - dia));
      setServicosPeriodStart(inicio.toISOString().slice(0, 10));
      setServicosPeriodEnd(fim.toISOString().slice(0, 10));
    } else if (kind === "mes") {
      setServicosPeriodStart(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10));
      setServicosPeriodEnd(new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10));
    } else if (kind === "tudo") {
      setServicosPeriodStart("2000-01-01");
      setServicosPeriodEnd("2100-01-01");
    }
  };
  // Relatório de Serviços por empresa: só pega o que já aparece em "Outros
  // Serviços Importantes" (lançado direto ali, ou como gasto extra marcado
  // como "importante") e que também tenha uma empresa marcada — não é
  // qualquer gasto extra com empresa, só os que já entram nesse relatório
  const relatorioServicos = useMemo(() => {
    let linhas = [];
    servicosVeiculo.forEach((s) => {
      if (s.empresa) {
        linhas.push({
          id: s.id, tripId: null, caminhaoId: s.caminhaoId, placa: truckLabel(s.caminhaoId),
          data: s.data, km: s.km || "", servico: s.tipoServico || "Serviço", empresa: s.empresa, valor: 0,
        });
      }
    });
    trips.forEach((t) => {
      (t.gastosExtras || []).forEach((g) => {
        if (g.importante && g.empresa) {
          linhas.push({
            id: g.id, tripId: t.id, caminhaoId: t.caminhaoId, placa: truckLabel(t.caminhaoId),
            data: g.data || t.data, km: g.km || "", servico: g.descricao || "Serviço", empresa: g.empresa, valor: Number(g.valor) || 0,
          });
        }
      });
    });
    linhas = linhas
      .filter((l) => l.data >= servicosPeriodStart && l.data <= servicosPeriodEnd)
      .filter((l) => servicosEmpresaFiltro === "all" || l.empresa === servicosEmpresaFiltro)
      .sort((a, b) => (b.data || "").localeCompare(a.data || ""));
    return { items: linhas };
  }, [trips, servicosVeiculo, servicosPeriodStart, servicosPeriodEnd, servicosEmpresaFiltro]);
  const [reabrirConsumoAoFecharViagem, setReabrirConsumoAoFecharViagem] = useState(false);
  const [consumoPeriodStart, setConsumoPeriodStart] = useState("2000-01-01");
  const [consumoPeriodEnd, setConsumoPeriodEnd] = useState("2100-01-01");
  const [consumoCaminhaoFiltro, setConsumoCaminhaoFiltro] = useState("all");
  const setConsumoQuickPeriod = (kind) => {
    const d = new Date();
    if (kind === "hoje") {
      const iso = d.toISOString().slice(0, 10);
      setConsumoPeriodStart(iso);
      setConsumoPeriodEnd(iso);
    } else if (kind === "semana") {
      const dia = d.getDay();
      const inicio = new Date(d); inicio.setDate(d.getDate() - dia);
      const fim = new Date(d); fim.setDate(d.getDate() + (6 - dia));
      setConsumoPeriodStart(inicio.toISOString().slice(0, 10));
      setConsumoPeriodEnd(fim.toISOString().slice(0, 10));
    } else if (kind === "mes") {
      setConsumoPeriodStart(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10));
      setConsumoPeriodEnd(new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10));
    } else if (kind === "tudo") {
      setConsumoPeriodStart("2000-01-01");
      setConsumoPeriodEnd("2100-01-01");
    }
  };
  const [gastosPeriodStart, setGastosPeriodStart] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
  });
  const [gastosPeriodEnd, setGastosPeriodEnd] = useState(() => todayISO());
  const [gastosSetorFiltro, setGastosSetorFiltro] = useState("all");
  const setGastosQuickPeriod = (kind) => {
    const d = new Date();
    if (kind === "hoje") {
      const iso = d.toISOString().slice(0, 10);
      setGastosPeriodStart(iso);
      setGastosPeriodEnd(iso);
    } else if (kind === "semana") {
      const dia = d.getDay();
      const inicio = new Date(d); inicio.setDate(d.getDate() - dia);
      const fim = new Date(d); fim.setDate(d.getDate() + (6 - dia));
      setGastosPeriodStart(inicio.toISOString().slice(0, 10));
      setGastosPeriodEnd(fim.toISOString().slice(0, 10));
    } else if (kind === "mes") {
      setGastosPeriodStart(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10));
      setGastosPeriodEnd(new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10));
    } else if (kind === "tudo") {
      setGastosPeriodStart("2000-01-01");
      setGastosPeriodEnd("2100-01-01");
    }
  };
  const [recebimentoPeriodStart, setRecebimentoPeriodStart] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
  });
  const [recebimentoPeriodEnd, setRecebimentoPeriodEnd] = useState(() => todayISO());
  const [recebimentoCaminhaoFiltro, setRecebimentoCaminhaoFiltro] = useState("all");

  const [boletosReportOpen, setBoletosReportOpen] = useState(false);
  const [boletosPeriodStart, setBoletosPeriodStart] = useState(() => todayISO().slice(0, 8) + "01");
  const [boletosPeriodEnd, setBoletosPeriodEnd] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10);
  });
  const [boletosReportStatus, setBoletosReportStatus] = useState("all");

  const [abastecReportOpen, setAbastecReportOpen] = useState(false);
  const [abastecPeriodStart, setAbastecPeriodStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const start = new Date(d);
    start.setDate(d.getDate() - day);
    return start.toISOString().slice(0, 10);
  });
  const [abastecPeriodEnd, setAbastecPeriodEnd] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const end = new Date(d);
    end.setDate(d.getDate() + (6 - day));
    return end.toISOString().slice(0, 10);
  });
  const [abastecPostoFilter, setAbastecPostoFilter] = useState("all");
  const [abastecPlacaFilter, setAbastecPlacaFilter] = useState("all");

  const [oleoPeriodStart, setOleoPeriodStart] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
  });
  const [oleoPeriodEnd, setOleoPeriodEnd] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10);
  });
  const [oleoPlacaFilter, setOleoPlacaFilter] = useState("all");
  const [addingTrocaOleo, setAddingTrocaOleo] = useState(false);
  const [editingTrocaOleoId, setEditingTrocaOleoId] = useState(null);
  const [trocaOleoCaminhaoId, setTrocaOleoCaminhaoId] = useState("");
  const [trocaOleoData, setTrocaOleoData] = useState("");
  const [trocaOleoKm, setTrocaOleoKm] = useState("");
  const [trocaOleoFiltro, setTrocaOleoFiltro] = useState(false);
  const [trocaOleoObs, setTrocaOleoObs] = useState("");

  const setOleoQuickPeriod = (kind) => {
    const d = new Date();
    if (kind === "hoje") {
      const iso = d.toISOString().slice(0, 10);
      setOleoPeriodStart(iso);
      setOleoPeriodEnd(iso);
    } else if (kind === "semana") {
      const day = d.getDay();
      const start = new Date(d); start.setDate(d.getDate() - day);
      const end = new Date(d); end.setDate(d.getDate() + (6 - day));
      setOleoPeriodStart(start.toISOString().slice(0, 10));
      setOleoPeriodEnd(end.toISOString().slice(0, 10));
    } else if (kind === "mes") {
      setOleoPeriodStart(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10));
      setOleoPeriodEnd(new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10));
    } else if (kind === "tudo") {
      setOleoPeriodStart("2000-01-01");
      setOleoPeriodEnd("2099-12-31");
    }
  };

  const startAddTrocaOleo = (caminhaoIdPreSelecionado) => {
    setAddingTrocaOleo(true);
    setEditingTrocaOleoId(null);
    setTrocaOleoCaminhaoId(caminhaoIdPreSelecionado || (trucks[0] && trucks[0].id) || "");
    setTrocaOleoData(new Date().toISOString().slice(0, 10));
    setTrocaOleoKm("");
    setTrocaOleoFiltro(false);
    setTrocaOleoObs("");
  };

  const startEditTrocaOleo = (t) => {
    setAddingTrocaOleo(true);
    setEditingTrocaOleoId(t.id);
    setTrocaOleoCaminhaoId(t.caminhaoId);
    setTrocaOleoData(t.data);
    setTrocaOleoKm(t.km);
    setTrocaOleoFiltro(!!t.filtroTrocado);
    setTrocaOleoObs(t.observacao || "");
  };

  const confirmAddTrocaOleo = () => {
    if (!trocaOleoCaminhaoId || !trocaOleoData || !trocaOleoKm) {
      alert("Preencha o caminhão, a data e o km.");
      return;
    }
    if (editingTrocaOleoId) {
      updateTrocaOleo(editingTrocaOleoId, trocaOleoCaminhaoId, trocaOleoData, trocaOleoKm, trocaOleoFiltro, trocaOleoObs.trim());
    } else {
      addTrocaOleo(trocaOleoCaminhaoId, trocaOleoData, trocaOleoKm, trocaOleoFiltro, trocaOleoObs.trim());
    }
    setAddingTrocaOleo(false);
    setEditingTrocaOleoId(null);
  };

  const trocaOleoReport = useMemo(() => {
    const filtered = trocasOleo
      .filter((t) => t.data >= oleoPeriodStart && t.data <= oleoPeriodEnd)
      .filter((t) => oleoPlacaFilter === "all" || t.caminhaoId === oleoPlacaFilter)
      .sort((a, b) => truckLabel(a.caminhaoId).localeCompare(truckLabel(b.caminhaoId)) || (b.data || "").localeCompare(a.data || ""));
    return { items: filtered };
  }, [trocasOleo, oleoPeriodStart, oleoPeriodEnd, oleoPlacaFilter, trucks]);

  const exportTrocaOleoCSV = () => {
    const header = ["Placa", "Data", "KM", "Filtro trocado", "Observação"];
    const lines = [header.join(";")];
    trocaOleoReport.items.forEach((t) => {
      lines.push([truckLabel(t.caminhaoId), fmtDate(t.data), t.km, t.filtroTrocado ? "Sim" : "Não", t.observacao || ""].join(";"));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trocas-oleo-${oleoPeriodStart}-a-${oleoPeriodEnd}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const TIPOS_SERVICO_COMUNS = ["Troca de pneu", "Freios", "Suspensão", "Correia", "Bateria", "Revisão geral", "Elétrica"];

  const [servicoPeriodStart, setServicoPeriodStart] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
  });
  const [servicoPeriodEnd, setServicoPeriodEnd] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10);
  });
  const [servicoPlacaFilter, setServicoPlacaFilter] = useState("all");
  const [addingServico, setAddingServico] = useState(false);
  const [editingServicoId, setEditingServicoId] = useState(null);
  const [servicoCaminhaoId, setServicoCaminhaoId] = useState("");
  const [servicoData, setServicoData] = useState("");
  const [servicoKm, setServicoKm] = useState("");
  const [servicoTipo, setServicoTipo] = useState("");
  const [servicoTipoCustom, setServicoTipoCustom] = useState(false);
  const [servicoObs, setServicoObs] = useState("");
  const [servicoEmpresa, setServicoEmpresa] = useState("");
  const [servicoValorBoleto, setServicoValorBoleto] = useState("");
  const [servicoGerarBoleto, setServicoGerarBoleto] = useState(false);
  const [servicoVencimentoBoleto, setServicoVencimentoBoleto] = useState("");

  const setServicoQuickPeriod = (kind) => {
    const d = new Date();
    if (kind === "hoje") {
      const iso = d.toISOString().slice(0, 10);
      setServicoPeriodStart(iso);
      setServicoPeriodEnd(iso);
    } else if (kind === "semana") {
      const day = d.getDay();
      const start = new Date(d); start.setDate(d.getDate() - day);
      const end = new Date(d); end.setDate(d.getDate() + (6 - day));
      setServicoPeriodStart(start.toISOString().slice(0, 10));
      setServicoPeriodEnd(end.toISOString().slice(0, 10));
    } else if (kind === "mes") {
      setServicoPeriodStart(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10));
      setServicoPeriodEnd(new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10));
    } else if (kind === "tudo") {
      setServicoPeriodStart("2000-01-01");
      setServicoPeriodEnd("2099-12-31");
    }
  };

  const startAddServico = (caminhaoIdPreSelecionado) => {
    setAddingServico(true);
    setEditingServicoId(null);
    setServicoCaminhaoId(caminhaoIdPreSelecionado || (trucks[0] && trucks[0].id) || "");
    setServicoData(new Date().toISOString().slice(0, 10));
    setServicoKm("");
    setServicoTipo("");
    setServicoTipoCustom(false);
    setServicoObs("");
    setServicoEmpresa("");
    setServicoValorBoleto("");
    setServicoGerarBoleto(false);
    setServicoVencimentoBoleto("");
  };

  const startEditServico = (s) => {
    setAddingServico(true);
    setEditingServicoId(s.id);
    setServicoCaminhaoId(s.caminhaoId);
    setServicoData(s.data);
    setServicoKm(s.km || "");
    setServicoTipo(s.tipoServico || "");
    setServicoTipoCustom(true);
    setServicoObs(s.observacao || "");
    setServicoEmpresa(s.empresa || "");
    setServicoValorBoleto("");
    setServicoGerarBoleto(false);
    setServicoVencimentoBoleto("");
  };

  const confirmAddServico = () => {
    if (!servicoCaminhaoId || !servicoData || !servicoTipo.trim()) {
      alert("Preencha o caminhão, a data e o tipo de serviço.");
      return;
    }
    if (servicoGerarBoleto && (!servicoEmpresa || !servicoVencimentoBoleto || !(Number(servicoValorBoleto) > 0))) {
      alert("Pra gerar o boleto, preencha a empresa, o valor e o vencimento.");
      return;
    }
    if (editingServicoId) {
      updateServicoVeiculo(editingServicoId, servicoCaminhaoId, servicoData, servicoKm, servicoTipo.trim(), servicoObs.trim(), servicoEmpresa);
    } else {
      addServicoVeiculo(servicoCaminhaoId, servicoData, servicoKm, servicoTipo.trim(), servicoObs.trim(), servicoEmpresa);
    }
    if (servicoGerarBoleto && servicoEmpresa) {
      const novoBoleto = {
        id: uid(),
        empresa: servicoEmpresa,
        descricao: servicoTipo.trim() || "Serviço no caminhão",
        notaFiscal: "",
        valor: servicoValorBoleto,
        dataVencimento: servicoVencimentoBoleto,
        contaBancaria: "",
        dataPagamento: "",
        observacao: `Gerado automaticamente a partir de serviço do caminhão ${truckLabel(servicoCaminhaoId)} em ${fmtDate(servicoData)}`,
        desconto: "",
        descontoDescricao: "",
        juros: "",
        baixas: [],
        codigoBarras: "",
        linhaDigitavel: "",
        novoVencimento: "",
      };
      const nextBoletos = [...boletos, novoBoleto];
      setBoletos(nextBoletos);
      persist(trucks, trips, vales, nextBoletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo);
    }
    setAddingServico(false);
    setEditingServicoId(null);
  };

  // "Outros Serviços Importantes": junta os lançamentos feitos direto aqui
  // (servicosVeiculo) com os gastos extras de viagem marcados como "serviço
  // importante" — pra não precisar lançar a mesma coisa duas vezes
  const servicoVeiculoReport = useMemo(() => {
    const doServicoVeiculo = servicosVeiculo.map((s) => ({
      id: s.id, caminhaoId: s.caminhaoId, data: s.data, km: s.km, tipoServico: s.tipoServico, observacao: s.observacao, empresa: "", origem: "servico",
    }));
    const dosGastosExtras = [];
    trips.forEach((t) => {
      (t.gastosExtras || []).forEach((g) => {
        if (g.importante) {
          dosGastosExtras.push({
            id: g.id, caminhaoId: t.caminhaoId, data: g.data || t.data, km: g.km || "", tipoServico: g.descricao || "Serviço", observacao: g.empresa ? `Feito em ${g.empresa}` : "Feito na estrada", empresa: g.empresa || "", origem: "gasto", tripId: t.id,
          });
        }
      });
    });
    const filtered = [...doServicoVeiculo, ...dosGastosExtras]
      .filter((s) => s.data >= servicoPeriodStart && s.data <= servicoPeriodEnd)
      .filter((s) => servicoPlacaFilter === "all" || s.caminhaoId === servicoPlacaFilter)
      .sort((a, b) => (b.data || "").localeCompare(a.data || ""));
    return { items: filtered };
  }, [servicosVeiculo, trips, servicoPeriodStart, servicoPeriodEnd, servicoPlacaFilter]);

  const exportServicoVeiculoCSV = () => {
    const header = ["Placa", "Data", "KM", "Tipo de Serviço", "Observação"];
    const lines = [header.join(";")];
    servicoVeiculoReport.items.forEach((s) => {
      lines.push([truckLabel(s.caminhaoId), fmtDate(s.data), s.km || "", s.tipoServico, s.observacao || ""].join(";"));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `outros-servicos-${servicoPeriodStart}-a-${servicoPeriodEnd}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---- Sem Parar ----
  const [semPararPeriodStart, setSemPararPeriodStart] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
  });
  const [semPararPeriodEnd, setSemPararPeriodEnd] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10);
  });
  const [semPararPlacaFilter, setSemPararPlacaFilter] = useState("all");
  const [addingSemParar, setAddingSemParar] = useState(false);
  const [editingSemPararId, setEditingSemPararId] = useState(null);
  const [semPararCaminhaoId, setSemPararCaminhaoId] = useState("");
  const [semPararCaminhaoCustom, setSemPararCaminhaoCustom] = useState(false);
  const [semPararData, setSemPararData] = useState("");
  const [semPararValorPedagio, setSemPararValorPedagio] = useState("");
  const [semPararValePedagio, setSemPararValePedagio] = useState("");
  const [semPararCredito, setSemPararCredito] = useState("");
  const [semPararObs, setSemPararObs] = useState("");
  const [colarCreditos, setColarCreditos] = useState("");
  const [outroSemPararData, setOutroSemPararData] = useState(() => new Date().toISOString().slice(0, 10));
  const [outroSemPararValor, setOutroSemPararValor] = useState("");
  const [outroSemPararObs, setOutroSemPararObs] = useState("");
  const [editingSemPararOutroId, setEditingSemPararOutroId] = useState(null);
  const [creditosUsados, setCreditosUsados] = useState({});
  const [creditosSomados, setCreditosSomados] = useState(null);

  const setSemPararQuickPeriod = (kind) => {
    const d = new Date();
    if (kind === "hoje") {
      const iso = d.toISOString().slice(0, 10);
      setSemPararPeriodStart(iso);
      setSemPararPeriodEnd(iso);
    } else if (kind === "semana") {
      const day = d.getDay();
      const start = new Date(d); start.setDate(d.getDate() - day);
      const end = new Date(d); end.setDate(d.getDate() + (6 - day));
      setSemPararPeriodStart(start.toISOString().slice(0, 10));
      setSemPararPeriodEnd(end.toISOString().slice(0, 10));
    } else if (kind === "mes") {
      setSemPararPeriodStart(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10));
      setSemPararPeriodEnd(new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10));
    } else if (kind === "tudo") {
      setSemPararPeriodStart("2000-01-01");
      setSemPararPeriodEnd("2099-12-31");
    }
  };

  const startAddSemParar = () => {
    setAddingSemParar(true);
    setEditingSemPararId(null);
    setSemPararCaminhaoId((trucks[0] && trucks[0].id) || "");
    setSemPararCaminhaoCustom(false);
    setSemPararData(new Date().toISOString().slice(0, 10));
    setSemPararValorPedagio("");
    setSemPararValePedagio("");
    setSemPararCredito("");
    setSemPararObs("");
  };

  const startEditSemParar = (s) => {
    setAddingSemParar(true);
    setEditingSemPararId(s.id);
    setSemPararCaminhaoId(s.caminhaoId);
    setSemPararCaminhaoCustom(false);
    setSemPararData(s.dataVencimento);
    setSemPararValorPedagio(s.valorPedagio || "");
    setSemPararValePedagio(s.valePedagio || "");
    setSemPararCredito(s.credito || "");
    setSemPararObs(s.observacao || "");
  };

  const confirmAddSemParar = () => {
    let caminhaoId = semPararCaminhaoId;
    if (semPararCaminhaoCustom) {
      caminhaoId = quickAddPlaca(semPararCaminhaoId);
      if (!caminhaoId) { alert("Digite a placa."); return; }
    }
    if (!caminhaoId || !semPararData || !semPararValorPedagio) {
      alert("Preencha a placa, a data de vencimento e o valor do pedágio.");
      return;
    }
    if (editingSemPararId) {
      updateSemParar(editingSemPararId, caminhaoId, semPararData, semPararValorPedagio, semPararValePedagio, semPararCredito, semPararObs.trim());
    } else {
      addSemParar(caminhaoId, semPararData, semPararValorPedagio, "", semPararCredito, semPararObs.trim());
    }
    setAddingSemParar(false);
    setEditingSemPararId(null);
  };

  const semPararReport = useMemo(() => {
    const filtered = semParar
      .filter((s) => s.dataVencimento >= semPararPeriodStart && s.dataVencimento <= semPararPeriodEnd)
      .filter((s) => semPararPlacaFilter === "all" || s.caminhaoId === semPararPlacaFilter);

    const outrosFiltrados = semPararOutros.filter((o) => o.data >= semPararPeriodStart && o.data <= semPararPeriodEnd);

    // agrupa cada remessa pela data de vencimento — cada uma com seu próprio total,
    // pra dar pra conferir contra a fatura de cada remessa antes de confirmar
    const porDataMap = {};
    filtered.forEach((s) => {
      const total = (Number(s.valorPedagio) || 0) - (Number(s.credito) || 0);
      if (!porDataMap[s.dataVencimento]) {
        porDataMap[s.dataVencimento] = { dataVencimento: s.dataVencimento, itemsPorPlaca: {}, outros: [], pedagio: 0, credito: 0, totalPlacas: 0, totalOutros: 0, temNaoConfirmado: false };
      }
      const grupo = porDataMap[s.dataVencimento];
      if (!grupo.itemsPorPlaca[s.caminhaoId]) grupo.itemsPorPlaca[s.caminhaoId] = { caminhaoId: s.caminhaoId, items: [], pedagio: 0, credito: 0, total: 0 };
      grupo.itemsPorPlaca[s.caminhaoId].items.push({ ...s, total });
      grupo.itemsPorPlaca[s.caminhaoId].pedagio += Number(s.valorPedagio) || 0;
      grupo.itemsPorPlaca[s.caminhaoId].credito += Number(s.credito) || 0;
      grupo.itemsPorPlaca[s.caminhaoId].total += total;
      grupo.pedagio += Number(s.valorPedagio) || 0;
      grupo.credito += Number(s.credito) || 0;
      grupo.totalPlacas += total;
      if (!s.confirmado) grupo.temNaoConfirmado = true;
    });
    // outras arrecadações entram na remessa da mesma data (se existir uma); senão,
    // ficam numa remessa própria só com elas
    outrosFiltrados.forEach((o) => {
      if (!porDataMap[o.data]) {
        porDataMap[o.data] = { dataVencimento: o.data, itemsPorPlaca: {}, outros: [], pedagio: 0, credito: 0, totalPlacas: 0, totalOutros: 0, temNaoConfirmado: false };
      }
      porDataMap[o.data].outros.push(o);
      porDataMap[o.data].totalOutros += Number(o.valor) || 0;
      if (!o.confirmado) porDataMap[o.data].temNaoConfirmado = true;
    });

    const porData = Object.values(porDataMap)
      .map((g) => ({
        ...g,
        porPlaca: Object.values(g.itemsPorPlaca).sort((a, b) => truckLabel(a.caminhaoId).localeCompare(truckLabel(b.caminhaoId))),
        totalRemessa: g.totalPlacas + g.totalOutros,
      }))
      .sort((a, b) => (a.dataVencimento || "").localeCompare(b.dataVencimento || ""));

    const porPlacaMap = {};
    filtered.forEach((s) => {
      const total = (Number(s.valorPedagio) || 0) - (Number(s.credito) || 0);
      if (!porPlacaMap[s.caminhaoId]) porPlacaMap[s.caminhaoId] = { caminhaoId: s.caminhaoId, items: [], pedagio: 0, credito: 0, total: 0 };
      porPlacaMap[s.caminhaoId].items.push({ ...s, total });
      porPlacaMap[s.caminhaoId].pedagio += Number(s.valorPedagio) || 0;
      porPlacaMap[s.caminhaoId].credito += Number(s.credito) || 0;
      porPlacaMap[s.caminhaoId].total += total;
    });
    const porPlaca = Object.values(porPlacaMap).sort((a, b) => truckLabel(a.caminhaoId).localeCompare(truckLabel(b.caminhaoId)));
    const totalPorPlacas = porPlaca.reduce(
      (acc, p) => ({
        pedagio: acc.pedagio + p.pedagio,
        credito: acc.credito + p.credito,
        total: acc.total + p.total,
      }),
      { pedagio: 0, credito: 0, total: 0 }
    );

    const totalOutros = outrosFiltrados.reduce((s, o) => s + (Number(o.valor) || 0), 0);

    const totals = { ...totalPorPlacas, outros: totalOutros, total: totalPorPlacas.total + totalOutros };
    return { porPlaca, porData, outros: outrosFiltrados, totals };
  }, [semParar, semPararOutros, semPararPeriodStart, semPararPeriodEnd, semPararPlacaFilter, trucks]);

  const exportSemPararCSV = () => {
    const header = ["Vencimento (remessa)", "Placa", "Pedágio", "Crédito", "Total", "Observação"];
    const lines = [header.join(";")];
    semPararReport.porData.forEach((remessa) => {
      remessa.porPlaca.forEach((p) => {
        p.items.forEach((s) => {
          lines.push([fmtDate(remessa.dataVencimento), truckLabel(s.caminhaoId), (Number(s.valorPedagio) || 0).toFixed(2), (Number(s.credito) || 0).toFixed(2), s.total.toFixed(2), s.observacao || ""].join(";"));
        });
      });
      remessa.outros.forEach((o) => {
        lines.push([fmtDate(remessa.dataVencimento), "(outras arrecadações)", "", "", (Number(o.valor) || 0).toFixed(2), o.observacao || ""].join(";"));
      });
      lines.push([`TOTAL REMESSA ${fmtDate(remessa.dataVencimento)}`, remessa.temNaoConfirmado ? "pendente" : "confirmado", "", "", remessa.totalRemessa.toFixed(2), ""].join(";"));
    });
    lines.push(["TOTAL GERAL", "", semPararReport.totals.pedagio.toFixed(2), semPararReport.totals.credito.toFixed(2), semPararReport.totals.total.toFixed(2), ""].join(";"));
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sem-parar-${semPararPeriodStart}-a-${semPararPeriodEnd}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // parser: cola varias linhas copiadas do pdf/extrato e soma o valor por placa
  const somarCreditosColados = () => {
    const linhas = colarCreditos.split("\n").filter((l) => l.trim());
    const regexPlaca = /([A-Z]{3}\s?\d[A-Z0-9]\d{2})/i;
    const regexValor = /(\d{1,3}(?:\.\d{3})*,\d{2})\s*C?\s*$/;
    const porPlaca = {};
    let linhasReconhecidas = 0;
    linhas.forEach((linha) => {
      const mPlaca = linha.match(regexPlaca);
      const mValor = linha.match(regexValor);
      if (mPlaca && mValor) {
        const placa = mPlaca[1].replace(/\s/g, "").toUpperCase();
        const valor = Number(mValor[1].replace(/\./g, "").replace(",", "."));
        if (!porPlaca[placa]) porPlaca[placa] = 0;
        porPlaca[placa] += valor;
        linhasReconhecidas++;
      }
    });
    const resultado = Object.entries(porPlaca)
      .map(([placa, total]) => ({ placa, total }))
      .sort((a, b) => b.total - a.total);
    setCreditosSomados({ resultado, linhasReconhecidas, totalLinhas: linhas.length });
    setCreditosUsados({});
  };

  const usarCreditoNoFormulario = (placa, valor) => {
    const caminhaoExistente = trucks.find((t) => t.placa.toUpperCase() === placa.toUpperCase());
    setAddingSemParar(true);
    if (caminhaoExistente) {
      setSemPararCaminhaoId(caminhaoExistente.id);
      setSemPararCaminhaoCustom(false);
    } else {
      setSemPararCaminhaoId(placa);
      setSemPararCaminhaoCustom(true);
    }
    setSemPararData(new Date().toISOString().slice(0, 10));
    setSemPararValorPedagio("");
    setSemPararCredito(valor.toFixed(2));
    setSemPararObs("Crédito colado do extrato");
    setCreditosUsados((prev) => ({ ...prev, [placa]: true }));
  };

  // ---- Seguro ----
  const [seguroMesFiltro, setSeguroMesFiltro] = useState(() => new Date().toISOString().slice(0, 7));
  const [addingSeguro, setAddingSeguro] = useState(false);
  const [editingSeguroId, setEditingSeguroId] = useState(null);
  const [seguroCavaloId, setSeguroCavaloId] = useState("");
  const [seguroCavaloValor, setSeguroCavaloValor] = useState("");
  const [seguroCarretaId, setSeguroCarretaId] = useState("");
  const [seguroCarretaCustom, setSeguroCarretaCustom] = useState(false);
  const [seguroCarretaValor, setSeguroCarretaValor] = useState("");
  const [seguroObs, setSeguroObs] = useState("");
  const [seguroSeguradoraCavalo, setSeguroSeguradoraCavalo] = useState("ATCMG");
  const [seguroSeguradoraCavaloCustom, setSeguroSeguradoraCavaloCustom] = useState(false);
  const [seguroSeguradoraCarreta, setSeguroSeguradoraCarreta] = useState("ATCMG");
  const [seguroSeguradoraCarretaCustom, setSeguroSeguradoraCarretaCustom] = useState(false);

  const startAddSeguro = () => {
    setAddingSeguro(true);
    setEditingSeguroId(null);
    const cavaloPadrao = trucksCavalos[0] || null;
    setSeguroCavaloId((cavaloPadrao && cavaloPadrao.id) || "");
    setSeguroCavaloValor("");
    setSeguroCarretaId((cavaloPadrao && cavaloPadrao.carretaVinculadaId) || "");
    setSeguroCarretaCustom(false);
    setSeguroCarretaValor("");
    setSeguroObs("");
    setSeguroSeguradoraCavalo("ATCMG");
    setSeguroSeguradoraCavaloCustom(false);
    setSeguroSeguradoraCarreta("ATCMG");
    setSeguroSeguradoraCarretaCustom(false);
  };

  const startEditSeguro = (s) => {
    if (s.confirmado) {
      alert("Esse lançamento já foi confirmado (já gerou boleto). Editar aqui não atualizaria o boleto já criado, então não dá pra editar direto — exclui e lança de novo se precisar corrigir algo.");
      return;
    }
    setAddingSeguro(true);
    setEditingSeguroId(s.id);
    setSeguroCavaloId(s.cavaloCaminhaoId);
    setSeguroCavaloValor(s.cavaloValor || "");
    setSeguroCarretaId(s.carretaCaminhaoId || "");
    setSeguroCarretaCustom(false);
    setSeguroCarretaValor(s.carretaValor || "");
    setSeguroObs(s.observacao || "");
    setSeguroSeguradoraCavalo(s.seguradoraCavalo || "ATCMG");
    setSeguroSeguradoraCavaloCustom(!["ATCMG", "TRANSPOSEG"].includes(s.seguradoraCavalo));
    setSeguroSeguradoraCarreta(s.seguradoraCarreta || "ATCMG");
    setSeguroSeguradoraCarretaCustom(!["ATCMG", "TRANSPOSEG"].includes(s.seguradoraCarreta));
  };

  const confirmAddSeguro = () => {
    let cavaloId = seguroCavaloId;
    if (!cavaloId || !seguroCavaloValor) {
      alert("Preencha o cavalo (placa) e o valor dele.");
      return;
    }
    let carretaId = "";
    if (seguroCarretaId) {
      carretaId = seguroCarretaCustom ? quickAddPlaca(seguroCarretaId, "carreta") : seguroCarretaId;
      if (seguroCarretaCustom && !carretaId) { alert("Digite a placa da carreta."); return; }
    }

    const cavaloValorNum = Number(seguroCavaloValor) || 0;
    const carretaValorNum = Number(seguroCarretaValor) || 0;

    if (editingSeguroId) {
      const nextSeguro = seguro.map((s) =>
        s.id === editingSeguroId
          ? {
              ...s,
              cavaloCaminhaoId: cavaloId,
              cavaloValor: cavaloValorNum.toFixed(2),
              carretaCaminhaoId: carretaId,
              carretaValor: carretaId ? carretaValorNum.toFixed(2) : "",
              observacao: seguroObs.trim(),
              seguradoraCavalo: seguroSeguradoraCavalo.trim().toUpperCase(),
              seguradoraCarreta: carretaId ? seguroSeguradoraCarreta.trim().toUpperCase() : "",
            }
          : s
      );
      setSeguro(nextSeguro);
      persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, nextSeguro, semPararOutros);
      setAddingSeguro(false);
      setEditingSeguroId(null);
      return;
    }

    const novoSeguro = {
      id: uid(),
      mes: seguroMesFiltro,
      cavaloCaminhaoId: cavaloId,
      cavaloValor: cavaloValorNum.toFixed(2),
      carretaCaminhaoId: carretaId,
      carretaValor: carretaId ? carretaValorNum.toFixed(2) : "",
      observacao: seguroObs.trim(),
      boletoIdCavalo: "",
      boletoIdCarreta: "",
      confirmado: false,
      seguradoraCavalo: seguroSeguradoraCavalo.trim().toUpperCase(),
      // se não tem carreta nesse lançamento, não faz sentido guardar seguradora de carreta
      seguradoraCarreta: carretaId ? seguroSeguradoraCarreta.trim().toUpperCase() : "",
    };
    const nextSeguro = [...seguro, novoSeguro];
    setSeguro(nextSeguro);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, nextSeguro, semPararOutros);
    setAddingSeguro(false);
  };

  const confirmarFinanceiroSeguro = () => {
    const doMes = seguro.filter((s) => s.mes === seguroMesFiltro && !s.confirmado);
    if (doMes.length === 0) {
      alert("Não tem lançamento novo pra confirmar nesse mês (ou já foi tudo confirmado antes).");
      return;
    }

    // cada seguradora manda um boleto separado de verdade, com seu próprio vencimento.
    // E como cavalo e carreta do MESMO lançamento podem ser de seguradoras diferentes,
    // a gente separa cada lançamento em "partes" (a parte do cavalo, a parte da
    // carreta) antes de agrupar por seguradora
    const partes = [];
    doMes.forEach((s) => {
      partes.push({
        seguroId: s.id,
        lado: "cavalo",
        seguradora: (s.seguradoraCavalo || "SEM SEGURADORA").toUpperCase(),
        valor: Number(s.cavaloValor) || 0,
        placa: truckLabel(s.cavaloCaminhaoId),
      });
      if (s.carretaCaminhaoId) {
        partes.push({
          seguroId: s.id,
          lado: "carreta",
          seguradora: (s.seguradoraCarreta || "SEM SEGURADORA").toUpperCase(),
          valor: Number(s.carretaValor) || 0,
          placa: truckLabel(s.carretaCaminhaoId),
        });
      }
    });

    const porSeguradora = {};
    partes.forEach((p) => {
      (porSeguradora[p.seguradora] = porSeguradora[p.seguradora] || []).push(p);
    });

    const totalGeral = partes.reduce((s, p) => s + p.valor, 0);
    const resumoConfirm = Object.entries(porSeguradora)
      .map(([nome, itens]) => {
        const total = itens.reduce((s, p) => s + p.valor, 0);
        const venc = vencimentoSeguro(nome, seguroMesFiltro);
        return `${nome}: ${BRL(total)} (${itens.length} placa${itens.length > 1 ? "s" : ""}) — vencimento ${fmtDate(venc)}`;
      })
      .join("\n");

    if (!window.confirm(`Confirmar o seguro de ${seguroMesFiltro}?\n\n${resumoConfirm}\n\nTotal geral: ${BRL(totalGeral)}\n\nIsso vai criar um boleto separado pra cada seguradora (com o vencimento certo de cada uma), e lançar a despesa (cavalo + carreta somados) no líquido mensal da placa do cavalo.`)) return;

    let nextEmpresas = empresas;
    const novosBoletos = [];
    const idBoletoPorSeguradora = {};
    const vencimentoPorSeguradora = {};
    Object.entries(porSeguradora).forEach(([nomeSeguradora, itens]) => {
      const totalSeguradora = itens.reduce((s, p) => s + p.valor, 0);
      const dataVencimento = vencimentoSeguro(nomeSeguradora, seguroMesFiltro);
      vencimentoPorSeguradora[nomeSeguradora] = dataVencimento;
      if (!nextEmpresas.some((e) => e.nome === nomeSeguradora)) {
        nextEmpresas = [...nextEmpresas, { id: uid(), nome: nomeSeguradora, categoria: "Despesas Operacionais" }];
      }
      const placasDescricao = itens.map((p) => p.placa).join(", ");
      const boleto = {
        id: uid(),
        empresa: nomeSeguradora,
        notaFiscal: "",
        valor: totalSeguradora.toFixed(2),
        dataVencimento,
        contaBancaria: "",
        dataPagamento: "",
        observacao: `Seguro ${seguroMesFiltro} — ${placasDescricao}`,
      };
      novosBoletos.push(boleto);
      idBoletoPorSeguradora[nomeSeguradora] = boleto.id;
    });
    const nextBoletos = [...boletos, ...novosBoletos];

    // cavalo + carreta entram juntos, num lancamento so, na placa do cavalo — usa
    // o vencimento da seguradora do CAVALO como data da despesa
    const novasDespesas = doMes.map((s) => {
      const totalConjunto = (Number(s.cavaloValor) || 0) + (Number(s.carretaValor) || 0);
      const mesmaSeguradora = !s.carretaCaminhaoId || s.seguradoraCavalo === s.seguradoraCarreta;
      const obsSeguradora = mesmaSeguradora
        ? ` (${s.seguradoraCavalo || "sem seguradora"})`
        : ` (cavalo: ${s.seguradoraCavalo || "sem seguradora"} · carreta: ${s.seguradoraCarreta || "sem seguradora"})`;
      const obsCarreta = s.carretaCaminhaoId ? ` — inclui carreta ${truckLabel(s.carretaCaminhaoId)}` : "";
      const dataDespesa = vencimentoPorSeguradora[(s.seguradoraCavalo || "SEM SEGURADORA").toUpperCase()];
      return {
        id: uid(),
        caminhaoId: s.cavaloCaminhaoId,
        data: dataDespesa,
        descricao: "Seguro",
        valor: totalConjunto.toFixed(2),
        observacao: `Seguro ${seguroMesFiltro}${obsSeguradora}${obsCarreta}`,
        origemSeguroId: s.id,
      };
    });
    const nextDespesas = [...despesasVeiculo, ...novasDespesas];

    const idsConfirmados = new Set(doMes.map((s) => s.id));
    const nextSeguro = seguro.map((s) => {
      if (!idsConfirmados.has(s.id)) return s;
      return {
        ...s,
        confirmado: true,
        boletoIdCavalo: idBoletoPorSeguradora[(s.seguradoraCavalo || "SEM SEGURADORA").toUpperCase()] || "",
        boletoIdCarreta: s.carretaCaminhaoId
          ? idBoletoPorSeguradora[(s.seguradoraCarreta || "SEM SEGURADORA").toUpperCase()] || ""
          : "",
      };
    });

    setEmpresas(nextEmpresas);
    setBoletos(nextBoletos);
    setDespesasVeiculo(nextDespesas);
    setSeguro(nextSeguro);
    persist(trucks, trips, vales, nextBoletos, nextEmpresas, fechamentos, nextDespesas, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, nextSeguro, semPararOutros);
    alert(`Confirmado! ${novosBoletos.length} boleto${novosBoletos.length > 1 ? "s" : ""} (um por seguradora) apareceu em Boletos, e a despesa entrou no líquido mensal de cada placa.`);
  };

  const seguroReport = useMemo(() => {
    const filtered = seguro.filter((s) => s.mes === seguroMesFiltro);
    const total = filtered.reduce((s, x) => s + (Number(x.cavaloValor) || 0) + (Number(x.carretaValor) || 0), 0);
    // total separado por seguradora — pra conferir se bateu com a fatura de cada uma
    // (cavalo e carreta do mesmo lançamento podem ser de seguradoras diferentes)
    const porSeguradora = {};
    filtered.forEach((x) => {
      const nomeCavalo = (x.seguradoraCavalo || "SEM SEGURADORA").toUpperCase();
      porSeguradora[nomeCavalo] = (porSeguradora[nomeCavalo] || 0) + (Number(x.cavaloValor) || 0);
      if (x.carretaCaminhaoId) {
        const nomeCarreta = (x.seguradoraCarreta || "SEM SEGURADORA").toUpperCase();
        porSeguradora[nomeCarreta] = (porSeguradora[nomeCarreta] || 0) + (Number(x.carretaValor) || 0);
      }
    });
    return { items: filtered.sort((a, b) => truckLabel(a.cavaloCaminhaoId).localeCompare(truckLabel(b.cavaloCaminhaoId))), total, porSeguradora };
  }, [seguro, seguroMesFiltro, trucks]);

  const exportSeguroCSV = () => {
    const header = ["Cavalo", "Valor Cavalo", "Seguradora Cavalo", "Vencimento Cavalo", "Carreta", "Valor Carreta", "Seguradora Carreta", "Vencimento Carreta", "Mês", "Total", "Observação"];
    const lines = [header.join(";")];
    seguroReport.items.forEach((s) => {
      const total = (Number(s.cavaloValor) || 0) + (Number(s.carretaValor) || 0);
      lines.push([
        truckLabel(s.cavaloCaminhaoId),
        (Number(s.cavaloValor) || 0).toFixed(2),
        s.seguradoraCavalo || "",
        fmtDate(vencimentoSeguro(s.seguradoraCavalo, s.mes)),
        s.carretaCaminhaoId ? truckLabel(s.carretaCaminhaoId) : "",
        s.carretaCaminhaoId ? (Number(s.carretaValor) || 0).toFixed(2) : "",
        s.carretaCaminhaoId ? (s.seguradoraCarreta || "") : "",
        s.carretaCaminhaoId ? fmtDate(vencimentoSeguro(s.seguradoraCarreta, s.mes)) : "",
        s.mes,
        total.toFixed(2),
        s.observacao || "",
      ].join(";"));
    });
    lines.push(["TOTAL", "", "", "", "", "", "", "", "", seguroReport.total.toFixed(2), ""].join(";"));
    Object.entries(seguroReport.porSeguradora).forEach(([nome, valor]) => {
      lines.push([`TOTAL ${nome}`, "", "", "", "", "", "", "", "", valor.toFixed(2), ""].join(";"));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seguro-${seguroMesFiltro}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---- autenticação com o Google ----
  const [gsiReady, setGsiReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [authError, setAuthError] = useState("");
  const [connecting, setConnecting] = useState(false);
  const tokenRef = useRef(null);
  const tokenClientRef = useRef(null);

  useEffect(() => {
    const check = setInterval(() => {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: SHEETS_SCOPE,
          callback: async (resp) => {
            if (resp.error) {
              setAuthError("O Google não autorizou o acesso. Tente novamente.");
              setConnecting(false);
              return;
            }
            tokenRef.current = resp.access_token;
            setSignedIn(true);
            setAuthError("");
            await reloadFromSheets();
            setConnecting(false);
            // se tinha alguma alteração presa sem conseguir salvar, aproveita
            // que acabou de conseguir um token novo e tenta salvar agora
            tentarSalvarPendencias();
          },
        });
        setGsiReady(true);
        clearInterval(check);
      }
    }, 200);
    return () => clearInterval(check);
  }, []);

  const connectGoogle = () => {
    if (!tokenClientRef.current) return;
    setConnecting(true);
    setAuthError("");
    tokenClientRef.current.requestAccessToken({ prompt: "" });
  };

  // desconecta da conta Google — avisa antes se tiver algo ainda não salvo,
  // igual acontece se a pessoa tentar fechar a aba
  const sair = () => {
    if (Object.keys(pendingChangesRef.current).length > 0) {
      if (!window.confirm("Tem alteração que ainda não foi salva na planilha. Sair mesmo assim?")) return;
    }
    if (tokenRef.current && window.google && window.google.accounts && window.google.accounts.oauth2) {
      window.google.accounts.oauth2.revoke(tokenRef.current, () => {});
    }
    tokenRef.current = null;
    setSignedIn(false);
    setLoaded(false);
    setSenhaAppDesbloqueada(false);
  };

  // guarda o que ainda não foi confirmado como salvo na planilha — enquanto isso não
  // estiver vazio, tem risco de perder lançamento se a aba for fechada
  const pendingChangesRef = useRef({});
  // trava simples pra nunca ter duas tentativas de salvar rodando ao mesmo tempo —
  // isso evitava que um retorno atrasado de uma tentativa antiga sobrescrevesse
  // o aviso de "salvo" de uma tentativa mais nova, deixando o aviso de erro preso
  // na tela mesmo depois de já ter salvo direitinho
  const salvandoAgoraRef = useRef(false);

  // pede um token novo pro Google sem precisar pedir login de novo (silencioso),
  // e espera até o token realmente mudar antes de seguir
  const refreshTokenSilently = () => new Promise((resolve) => {
    if (!tokenClientRef.current) { resolve(false); return; }
    const tokenAntes = tokenRef.current;
    tokenClientRef.current.requestAccessToken({ prompt: "" });
    let tentativas = 0;
    const checar = setInterval(() => {
      tentativas++;
      if (tokenRef.current !== tokenAntes) {
        clearInterval(checar);
        resolve(true);
      } else if (tentativas > 20) {
        clearInterval(checar);
        resolve(false);
      }
    }, 250);
  });

  // avisa antes de fechar a aba se tiver algo ainda não salvo de verdade
  useEffect(() => {
    const handler = (e) => {
      if (Object.keys(pendingChangesRef.current).length > 0) {
        e.preventDefault();
        e.returnValue = "Tem alteração que ainda não foi salva na planilha. Sair mesmo assim?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // o token do Google expira sozinho depois de ~1h. Sem isso, quem ficasse com o
  // app aberto por mais tempo que isso continuava lançando normalmente, mas nada
  // era salvo de verdade — o token ficava velho e toda gravação falhava silenciosa.
  // Aqui a gente renova ele sozinho de tempos em tempos, sem precisar logar de novo.
  useEffect(() => {
    if (!signedIn) return;
    const renovar = setInterval(() => {
      if (tokenClientRef.current) {
        tokenClientRef.current.requestAccessToken({ prompt: "" });
      }
    }, 45 * 60 * 1000);
    return () => clearInterval(renovar);
  }, [signedIn]);

  const reloadFromSheets = async () => {
    try {
      const { trucks: t, trips: v, vales: vl, boletos: bo, empresas: emp, fechamentos: fe, despesasVeiculo: dv, taxasPool: tp, motoristas: mo, contas: ct, trocasOleo: to, servicosVeiculo: sv, semParar: sp, seguro: sg, semPararOutros: spo, config: cfg } = await loadFromSheets(tokenRef.current);
      const trips = v.map(normalizeTrip);
      const fechamentosMigrados = migrarFechamentosAntigos(fe, trips, vl);
      const trucksMigrados = migrarTiposDePlaca(t, sg);
      const { empresas: empresasMigradas, boletos: boletosMigrados } = migrarEmpresasParaMaiuscula(emp, bo);
      setTrucks(trucksMigrados);
      setTrips(trips);
      setVales(vl);
      setBoletos(boletosMigrados);
      setEmpresas(empresasMigradas);
      setFechamentos(fechamentosMigrados);
      setDespesasVeiculo(dv);
      setTaxasPool(tp);
      setMotoristas(mo);
      setContas(ct);
      setTrocasOleo(to);
      setServicosVeiculo(sv);
      setSemParar(sp);
      setSeguro(sg);
      setSemPararOutros(spo);
      setConfig(cfg);
      // aplica os valores configurados (ou o padrão, se ainda não tiver nada salvo)
      const percentualSalvo = cfg.find((c) => c.chave === "percentualComissao");
      const intervaloSalvo = cfg.find((c) => c.chave === "intervaloOleoKm");
      const regrasVencimentoSalvas = cfg.find((c) => c.chave === "regrasVencimentoSeguro");
      CONFIG_PERCENTUAL_COMISSAO = percentualSalvo ? Number(percentualSalvo.valor) || 13 : 13;
      CONFIG_INTERVALO_OLEO_KM = intervaloSalvo ? Number(intervaloSalvo.valor) || 25000 : 25000;
      if (regrasVencimentoSalvas) {
        const parsed = safeParseJSON(regrasVencimentoSalvas.valor, null);
        if (parsed) CONFIG_REGRAS_VENCIMENTO_SEGURO = parsed;
      }
      const categoriasSalvas = cfg.find((c) => c.chave === "categoriasEmpresaCustom");
      if (categoriasSalvas) {
        const parsed = safeParseJSON(categoriasSalvas.valor, null);
        if (parsed && parsed.length > 0) setCategoriasEmpresaLista(parsed);
      }
      const empresasAlertaSalvas = cfg.find((c) => c.chave === "empresasExcluidasAlertaVencido");
      if (empresasAlertaSalvas) {
        const parsed = safeParseJSON(empresasAlertaSalvas.valor, null);
        if (parsed) setEmpresasExcluidasAlertaVencido(parsed);
      }
      const categoriasDashboardSalvas = cfg.find((c) => c.chave === "categoriasIncluidasDashboardGeral");
      if (categoriasDashboardSalvas) {
        const parsed = safeParseJSON(categoriasDashboardSalvas.valor, null);
        if (parsed) setCategoriasIncluidasDashboardGeral(parsed);
      }
      const precosPostosSalvos = cfg.find((c) => c.chave === "precosPostos");
      if (precosPostosSalvos) {
        const parsed = safeParseJSON(precosPostosSalvos.valor, null);
        if (parsed) setPrecosPostos(parsed);
      }
      setLoaded(true);
      // se algum fechamento antigo precisou ser convertido, salva essa conversão
      // de volta na planilha (só a aba de Fechamentos), pra não precisar refazer
      // toda vez que o app carregar
      if (fechamentosMigrados !== fe) {
        saveToSheets(tokenRef.current, { fechamentos: fechamentosMigrados }).catch(() => {});
      }
      // idem pra correção de placas de carreta que estavam marcadas como cavalo
      if (trucksMigrados !== t) {
        saveToSheets(tokenRef.current, { trucks: trucksMigrados }).catch(() => {});
      }
      // idem pra padronizar nomes de empresa em maiúscula (cadastro + boletos antigos)
      if (empresasMigradas !== emp || boletosMigrados !== bo) {
        saveToSheets(tokenRef.current, { empresas: empresasMigradas, boletos: boletosMigrados }).catch(() => {});
      }
    } catch (e) {
      setAuthError("Não consegui ler a planilha. Confira se ela foi compartilhada corretamente e tente de novo.");
      setLoaded(true);
    }
  };

  // aplica "Despesas Estrada" em todo gasto extra já lançado que ainda não
  // tem categoria nenhuma — pra não precisar abrir viagem por viagem na mão
  const aplicarCategoriaPadraoGastosAntigos = () => {
    let quantidadeAtualizada = 0;
    const nextTrips = trips.map((t) => {
      if (!t.gastosExtras || t.gastosExtras.length === 0) return t;
      let mudou = false;
      const gastosExtras = t.gastosExtras.map((g) => {
        if (g.categoria && g.categoria.trim()) return g;
        mudou = true;
        quantidadeAtualizada += 1;
        return { ...g, categoria: "Despesas Estrada" };
      });
      return mudou ? { ...t, gastosExtras } : t;
    });
    if (quantidadeAtualizada === 0) {
      alert("Todos os gastos extras já têm uma categoria — não tinha nenhum pra atualizar.");
      return;
    }
    if (!window.confirm(`Isso vai marcar ${quantidadeAtualizada} gasto(s) extra(s) sem categoria como "Despesas Estrada". Confirma?`)) return;
    setTrips(nextTrips);
    persist(trucks, nextTrips);
    alert(`Pronto! ${quantidadeAtualizada} gasto(s) marcado(s) como "Despesas Estrada".`);
  };

  const persist = async (nextTrucks, nextTrips, nextVales = vales, nextBoletos = boletos, nextEmpresas = empresas, nextFechamentos = fechamentos, nextDespesasVeiculo = despesasVeiculo, nextTaxasPool = taxasPool, nextMotoristas = motoristas, nextContas = contas, nextTrocasOleo = trocasOleo, nextServicosVeiculo = servicosVeiculo, nextSemParar = semParar, nextSeguro = seguro, nextSemPararOutros = semPararOutros, nextConfig = config) => {
    // so entra no pacote de salvamento quem realmente mudou (comparando pela referência) —
    // assim cada ação mexe só na aba dela, em vez de reescrever a planilha toda de novo.
    const changes = {};
    if (nextTrucks !== trucks) changes.trucks = nextTrucks;
    if (nextTrips !== trips) changes.trips = nextTrips;
    if (nextVales !== vales) changes.vales = nextVales;
    if (nextBoletos !== boletos) changes.boletos = nextBoletos;
    if (nextEmpresas !== empresas) changes.empresas = nextEmpresas;
    if (nextFechamentos !== fechamentos) changes.fechamentos = nextFechamentos;
    if (nextDespesasVeiculo !== despesasVeiculo) changes.despesasVeiculo = nextDespesasVeiculo;
    if (nextTaxasPool !== taxasPool) changes.taxasPool = nextTaxasPool;
    if (nextMotoristas !== motoristas) changes.motoristas = nextMotoristas;
    if (nextContas !== contas) changes.contas = nextContas;
    if (nextTrocasOleo !== trocasOleo) changes.trocasOleo = nextTrocasOleo;
    if (nextServicosVeiculo !== servicosVeiculo) changes.servicosVeiculo = nextServicosVeiculo;
    if (nextSemParar !== semParar) changes.semParar = nextSemParar;
    if (nextSeguro !== seguro) changes.seguro = nextSeguro;
    if (nextSemPararOutros !== semPararOutros) changes.semPararOutros = nextSemPararOutros;
    if (nextConfig !== config) changes.config = nextConfig;

    if (Object.keys(changes).length === 0) return;

    // guarda o que ainda não foi confirmado como salvo — se der erro, isso não some,
    // fica acumulado pra próxima tentativa (automática ou pelo botão Salvar) tentar de novo
    pendingChangesRef.current = { ...pendingChangesRef.current, ...changes };
    await tentarSalvarPendencias();
  };

  const tentarSalvarPendencias = async () => {
    if (Object.keys(pendingChangesRef.current).length === 0) return;

    // se já tem uma tentativa rodando, essa nova espera ela terminar em vez de
    // rodar por cima — assim que a que está rodando salvar o que já tem, essa
    // função é chamada de novo automaticamente logo abaixo com o que sobrou
    if (salvandoAgoraRef.current) return;
    salvandoAgoraRef.current = true;

    if (!tokenRef.current) {
      setSaveState("error");
      salvandoAgoraRef.current = false;
      return;
    }

    setSaveState("saving");
    let sucedeu = false;
    // guarda uma "foto" exata do que está sendo enviado agora — assim, depois,
    // só removemos daqui exatamente isso, sem apagar por engano algo novo que
    // tenha chegado enquanto esse envio ainda estava rodando
    const enviandoAgora = pendingChangesRef.current;
    const removerDoPendente = (enviado) => {
      const restante = { ...pendingChangesRef.current };
      Object.keys(enviado).forEach((k) => {
        if (restante[k] === enviado[k]) delete restante[k];
      });
      pendingChangesRef.current = restante;
    };
    try {
      await saveToSheets(tokenRef.current, enviandoAgora);
      removerDoPendente(enviandoAgora);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1200);
      sucedeu = true;
    } catch (e) {
      if (e.isPermissionError) {
        setSaveState("readonly");
      } else {
        // pode ser o token expirado (isso acontece sozinho depois de ~1h) —
        // tenta renovar sem pedir login de novo, e salvar mais uma vez antes de desistir
        const renovou = await refreshTokenSilently();
        if (renovou) {
          try {
            await saveToSheets(tokenRef.current, enviandoAgora);
            removerDoPendente(enviandoAgora);
            setSaveState("saved");
            setTimeout(() => setSaveState("idle"), 1200);
            sucedeu = true;
          } catch (e2) {
            setSaveState("error");
          }
        } else {
          setSaveState("error");
        }
      }
    } finally {
      salvandoAgoraRef.current = false;
      // só encadeia uma nova tentativa automática se essa deu certo e chegou
      // lançamento novo enquanto ela rodava — se deu erro, não fica tentando
      // sem parar sozinho (evita ficar batendo na API sem parar offline)
      if (sucedeu && Object.keys(pendingChangesRef.current).length > 0) {
        tentarSalvarPendencias();
      }
    }
  };

  const addVale = (motorista, data, valor, tipo, observacao) => {
    const nextVales = [...vales, { id: uid(), motorista, data, valor, tipo, observacao }];
    setVales(nextVales);
    persist(trucks, trips, nextVales);
  };

  const updateVale = (id, data, valor, tipo, observacao) => {
    const nextVales = vales.map((v) => (v.id === id ? { ...v, data, valor, tipo, observacao } : v));
    setVales(nextVales);
    persist(trucks, trips, nextVales);
  };

  const addValesMultiple = (novos) => {
    const nextVales = [...vales, ...novos];
    setVales(nextVales);
    persist(trucks, trips, nextVales);
  };

  const deleteVale = (id) => {
    const v = vales.find((x) => x.id === id);
    const tipoLabel = v && v.tipo === "reembolso" ? "reembolso" : "vale";
    const detalhe = v ? ` de ${BRL(Number(v.valor) || 0)} (${fmtDate(v.data)})` : "";
    if (!window.confirm(`Tem certeza que deseja excluir este ${tipoLabel}${detalhe}?`)) return;
    const nextVales = vales.filter((v) => v.id !== id);
    setVales(nextVales);
    persist(trucks, trips, nextVales);
  };

  const saveBoleto = (boleto) => {
    const exists = boletos.some((b) => b.id === boleto.id);
    const nextBoletos = exists ? boletos.map((b) => (b.id === boleto.id ? boleto : b)) : [...boletos, boleto];
    setBoletos(nextBoletos);
    persist(trucks, trips, vales, nextBoletos);
  };

  const saveBoletosMultiple = (novosBoletos) => {
    const nextBoletos = [...boletos, ...novosBoletos];
    setBoletos(nextBoletos);
    persist(trucks, trips, vales, nextBoletos);
  };

  const deleteBoleto = (id) => {
    const b = boletos.find((x) => x.id === id);
    const detalhe = b ? ` de ${b.empresa || "?"} (${BRL(Number(b.valor) || 0)})` : "";
    if (!window.confirm(`Tem certeza que deseja excluir este boleto${detalhe}?`)) return;
    const nextBoletos = boletos.filter((b) => b.id !== id);
    setBoletos(nextBoletos);
    persist(trucks, trips, vales, nextBoletos);
  };

  // salva a lista de categorias na planilha (aba Config), do mesmo jeito que
  // as outras configurações — assim fica salva pra próxima vez que abrir o app
  const salvarCategoriasEmpresa = (novaLista) => {
    const nextConfig = [
      ...config.filter((c) => c.chave !== "categoriasEmpresaCustom"),
      { chave: "categoriasEmpresaCustom", valor: JSON.stringify(novaLista) },
    ];
    setConfig(nextConfig);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, seguro, semPararOutros, nextConfig);
  };

  const alternarEmpresaAlertaVencido = (nomeEmpresa) => {
    const novaLista = empresasExcluidasAlertaVencido.includes(nomeEmpresa)
      ? empresasExcluidasAlertaVencido.filter((n) => n !== nomeEmpresa)
      : [...empresasExcluidasAlertaVencido, nomeEmpresa];
    setEmpresasExcluidasAlertaVencido(novaLista);
    const nextConfig = [
      ...config.filter((c) => c.chave !== "empresasExcluidasAlertaVencido"),
      { chave: "empresasExcluidasAlertaVencido", valor: JSON.stringify(novaLista) },
    ];
    setConfig(nextConfig);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, seguro, semPararOutros, nextConfig);
  };

  const alternarCategoriaDashboardGeral = (nomeCategoria) => {
    const novaLista = categoriasIncluidasDashboardGeral.includes(nomeCategoria)
      ? categoriasIncluidasDashboardGeral.filter((n) => n !== nomeCategoria)
      : [...categoriasIncluidasDashboardGeral, nomeCategoria];
    setCategoriasIncluidasDashboardGeral(novaLista);
    const nextConfig = [
      ...config.filter((c) => c.chave !== "categoriasIncluidasDashboardGeral"),
      { chave: "categoriasIncluidasDashboardGeral", valor: JSON.stringify(novaLista) },
    ];
    setConfig(nextConfig);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, seguro, semPararOutros, nextConfig);
  };

  const adicionarCategoriaEmpresa = (nomeBruto) => {
    const nome = nomeBruto.trim();
    if (!nome) return;
    if (categoriasEmpresaLista.some((c) => c.toLowerCase() === nome.toLowerCase())) {
      alert("Já existe uma categoria com esse nome.");
      return;
    }
    const novaLista = [...categoriasEmpresaLista, nome];
    setCategoriasEmpresaLista(novaLista);
    salvarCategoriasEmpresa(novaLista);
  };

  const renomearCategoriaEmpresa = (indice, novoNomeBruto) => {
    const novoNome = novoNomeBruto.trim();
    const nomeAntigo = categoriasEmpresaLista[indice];
    if (!novoNome || novoNome === nomeAntigo) return;
    if (categoriasEmpresaLista.some((c, i) => i !== indice && c.toLowerCase() === novoNome.toLowerCase())) {
      alert("Já existe uma categoria com esse nome.");
      return;
    }
    const novaLista = categoriasEmpresaLista.map((c, i) => (i === indice ? novoNome : c));
    const nextEmpresas = empresas.map((e) => (e.categoria === nomeAntigo ? { ...e, categoria: novoNome } : e));
    setCategoriasEmpresaLista(novaLista);
    setEmpresas(nextEmpresas);
    salvarCategoriasEmpresa(novaLista);
    persist(trucks, trips, vales, boletos, nextEmpresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, seguro, semPararOutros, config);
  };

  const removerCategoriaEmpresa = (indice) => {
    const nomeRemovido = categoriasEmpresaLista[indice];
    if (!window.confirm(`Remover a categoria "${nomeRemovido}"? As empresas que estavam nela vão pra "Outros".`)) return;
    const novaLista = categoriasEmpresaLista.filter((_, i) => i !== indice);
    const nextEmpresas = empresas.map((e) => (e.categoria === nomeRemovido ? { ...e, categoria: "Outros" } : e));
    setCategoriasEmpresaLista(novaLista);
    setEmpresas(nextEmpresas);
    salvarCategoriasEmpresa(novaLista);
    persist(trucks, trips, vales, boletos, nextEmpresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, seguro, semPararOutros, config);
  };

  const addEmpresa = (nome) => {
    const limpo = nome.trim().toUpperCase();
    if (!limpo) return;
    if (empresas.some((e) => e.nome.toUpperCase() === limpo)) return;
    const nextEmpresas = [...empresas, { id: uid(), nome: limpo, categoria: "" }];
    setEmpresas(nextEmpresas);
    persist(trucks, trips, vales, boletos, nextEmpresas);
  };

  const setCategoriaEmpresaPorNome = (nome, categoria) => {
    const existente = empresas.find((e) => e.nome === nome);
    const nextEmpresas = existente
      ? empresas.map((e) => (e.nome === nome ? { ...e, categoria } : e))
      : [...empresas, { id: uid(), nome, categoria }];
    setEmpresas(nextEmpresas);
    persist(trucks, trips, vales, boletos, nextEmpresas);
  };

  const removeEmpresa = (id) => {
    const nome = empresas.find((e) => e.id === id)?.nome || "essa empresa";
    if (!window.confirm(`Tem certeza que deseja remover a empresa "${nome}" da lista?`)) return;
    const nextEmpresas = empresas.filter((e) => e.id !== id);
    setEmpresas(nextEmpresas);
    persist(trucks, trips, vales, boletos, nextEmpresas);
  };

  const setCategoriaEmpresa = (id, categoria) => {
    const nextEmpresas = empresas.map((e) => (e.id === id ? { ...e, categoria } : e));
    setEmpresas(nextEmpresas);
    persist(trucks, trips, vales, boletos, nextEmpresas);
  };

  const setIncluirRelatorioEmpresa = (id, incluir) => {
    const nextEmpresas = empresas.map((e) => (e.id === id ? { ...e, incluirRelatorio: incluir } : e));
    setEmpresas(nextEmpresas);
    persist(trucks, trips, vales, boletos, nextEmpresas);
  };

  // renomeia uma empresa e atualiza o texto do nome nos boletos já lançados que
  // usavam o nome antigo — só o texto, nenhum valor/data muda. Sem isso, o boleto
  // antigo ficaria "órfão" com um nome que não existe mais no cadastro.
  const renomearEmpresa = (id, novoNomeBruto) => {
    const novoNome = novoNomeBruto.trim().toUpperCase();
    if (!novoNome) return;
    const empresaAtual = empresas.find((e) => e.id === id);
    if (!empresaAtual || empresaAtual.nome === novoNome) return;
    const nomeAntigo = empresaAtual.nome;
    // se já existe outra empresa cadastrada com esse nome novo, funde nela em vez
    // de deixar duas empresas cadastradas com o mesmo nome
    const outraComMesmoNome = empresas.find((e) => e.id !== id && e.nome === novoNome);
    const nextEmpresas = outraComMesmoNome
      ? empresas.filter((e) => e.id !== id).map((e) => (e.id === outraComMesmoNome.id && !e.categoria && empresaAtual.categoria ? { ...e, categoria: empresaAtual.categoria } : e))
      : empresas.map((e) => (e.id === id ? { ...e, nome: novoNome } : e));
    const nextBoletos = boletos.map((b) => (b.empresa === nomeAntigo ? { ...b, empresa: novoNome } : b));
    setEmpresas(nextEmpresas);
    setBoletos(nextBoletos);
    persist(trucks, trips, vales, nextBoletos, nextEmpresas);
  };

  const addFechamento = (motorista, data, valor) => {
    const nextFechamentos = [...fechamentos, { id: uid(), motorista, data, valor }];
    setFechamentos(nextFechamentos);
    persist(trucks, trips, vales, boletos, empresas, nextFechamentos);
  };

  const deleteFechamento = (id) => {
    const nextFechamentos = fechamentos.filter((f) => f.id !== id);
    setFechamentos(nextFechamentos);
    persist(trucks, trips, vales, boletos, empresas, nextFechamentos);
  };

  const addDespesaVeiculo = (caminhaoId, data, descricao, valor, observacao) => {
    const nextDespesas = [...despesasVeiculo, { id: uid(), caminhaoId, data, descricao, valor, observacao }];
    setDespesasVeiculo(nextDespesas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, nextDespesas);
  };

  const updateDespesaVeiculo = (id, caminhaoId, data, descricao, valor, observacao) => {
    const nextDespesas = despesasVeiculo.map((d) => (d.id === id ? { ...d, caminhaoId, data, descricao, valor, observacao } : d));
    setDespesasVeiculo(nextDespesas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, nextDespesas);
  };

  const deleteDespesaVeiculo = (id) => {
    const d = despesasVeiculo.find((x) => x.id === id);
    const detalhe = d ? ` "${d.descricao}" (${BRL(Number(d.valor) || 0)})` : "";
    if (!window.confirm(`Tem certeza que deseja excluir esta despesa${detalhe}?`)) return;
    const nextDespesas = despesasVeiculo.filter((d) => d.id !== id);
    setDespesasVeiculo(nextDespesas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, nextDespesas);
  };

  const addTaxaPool = (mes, data, valor, descricao) => {
    const nextTaxas = [...taxasPool, { id: uid(), mes, data, valor, descricao }];
    setTaxasPool(nextTaxas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, nextTaxas);
  };

  const updateTaxaPool = (id, mes, data, valor, descricao) => {
    const nextTaxas = taxasPool.map((t) => (t.id === id ? { ...t, mes, data, valor, descricao } : t));
    setTaxasPool(nextTaxas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, nextTaxas);
  };

  const deleteTaxaPool = (id) => {
    const t = taxasPool.find((x) => x.id === id);
    const detalhe = t ? ` de ${BRL(Number(t.valor) || 0)}` : "";
    if (!window.confirm(`Tem certeza que deseja excluir esta taxa${detalhe}?`)) return;
    const nextTaxas = taxasPool.filter((t) => t.id !== id);
    setTaxasPool(nextTaxas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, nextTaxas);
  };

  const distribuirTaxas = (mes) => {
    const doMes = taxasPool.filter((t) => t.mes === mes);
    if (doMes.length === 0 || trucksCavalos.length === 0) return;
    const total = doMes.reduce((s, t) => s + (Number(t.valor) || 0), 0);
    const porCaminhao = total / trucksCavalos.length;
    if (!window.confirm(`Dividir ${BRL(total)} de taxas entre os ${trucksCavalos.length} caminhões (${BRL(porCaminhao)} cada)? Isso lança a despesa em cada placa e limpa o cofrinho desse mês.`)) return;

    const descricaoResumo = `Taxa de viagem (rateio: ${BRL(total)} dividido entre os ${trucksCavalos.length} caminhões)`;
    const dataLancamento = new Date(Number(mes.slice(0, 4)), Number(mes.slice(5, 7)), 0).toISOString().slice(0, 10);

    const novasDespesas = trucksCavalos.map((tr) => ({
      id: uid(),
      caminhaoId: tr.id,
      data: dataLancamento,
      descricao: descricaoResumo,
      valor: porCaminhao.toFixed(2),
      observacao: `Rateio de ${BRL(total)} entre ${trucksCavalos.length} caminhões`,
    }));

    const nextDespesas = [...despesasVeiculo, ...novasDespesas];
    const nextTaxas = taxasPool.filter((t) => t.mes !== mes);
    setDespesasVeiculo(nextDespesas);
    setTaxasPool(nextTaxas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, nextDespesas, nextTaxas);
  };

  const addMotorista = (nome) => {
    const limpo = nome.trim();
    if (!limpo) return;
    if (motoristas.some((m) => m.nome.toLowerCase() === limpo.toLowerCase())) return;
    const nextMotoristas = [...motoristas, { id: uid(), nome: limpo }];
    setMotoristas(nextMotoristas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, nextMotoristas);
  };

  const removeMotorista = (id) => {
    const nome = motoristas.find((m) => m.id === id)?.nome || "esse motorista";
    if (!window.confirm(`Tem certeza que deseja remover "${nome}" da lista de motoristas?`)) return;
    const nextMotoristas = motoristas.filter((m) => m.id !== id);
    setMotoristas(nextMotoristas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, nextMotoristas);
  };

  const addConta = (nome) => {
    const limpo = nome.trim();
    if (!limpo) return;
    if (contasBancariasList.includes(limpo)) return;
    const nextContas = [...contas, { id: uid(), nome: limpo }];
    setContas(nextContas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, nextContas);
  };

  const removeConta = (id) => {
    const nome = contas.find((c) => c.id === id)?.nome || "essa conta";
    if (!window.confirm(`Tem certeza que deseja remover "${nome}" da lista de contas?`)) return;
    const nextContas = contas.filter((c) => c.id !== id);
    setContas(nextContas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, nextContas);
  };

  const addTrocaOleo = (caminhaoId, data, km, filtroTrocado, observacao) => {
    const nextTrocas = [...trocasOleo, { id: uid(), caminhaoId, data, km, filtroTrocado, observacao }];
    setTrocasOleo(nextTrocas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, nextTrocas);
  };

  const updateTrocaOleo = (id, caminhaoId, data, km, filtroTrocado, observacao) => {
    const nextTrocas = trocasOleo.map((t) => (t.id === id ? { ...t, caminhaoId, data, km, filtroTrocado, observacao } : t));
    setTrocasOleo(nextTrocas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, nextTrocas);
  };

  const deleteTrocaOleo = (id) => {
    const t = trocasOleo.find((x) => x.id === id);
    const detalhe = t ? ` de ${truckLabel(t.caminhaoId)} (${t.km} km)` : "";
    if (!window.confirm(`Tem certeza que deseja excluir esta troca de óleo${detalhe}?`)) return;
    const nextTrocas = trocasOleo.filter((t) => t.id !== id);
    setTrocasOleo(nextTrocas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, nextTrocas);
  };

  const addServicoVeiculo = (caminhaoId, data, km, tipoServico, observacao, empresa) => {
    const nextServicos = [...servicosVeiculo, { id: uid(), caminhaoId, data, km, tipoServico, observacao, empresa: empresa || "" }];
    setServicosVeiculo(nextServicos);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, nextServicos);
  };

  const updateServicoVeiculo = (id, caminhaoId, data, km, tipoServico, observacao, empresa) => {
    const nextServicos = servicosVeiculo.map((s) => (s.id === id ? { ...s, caminhaoId, data, km, tipoServico, observacao, empresa: empresa || "" } : s));
    setServicosVeiculo(nextServicos);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, nextServicos);
  };

  const deleteServicoVeiculo = (id) => {
    const s = servicosVeiculo.find((x) => x.id === id);
    const detalhe = s ? ` (${s.tipoServico} · ${truckLabel(s.caminhaoId)})` : "";
    if (!window.confirm(`Tem certeza que deseja excluir este serviço${detalhe}?`)) return;
    const nextServicos = servicosVeiculo.filter((s) => s.id !== id);
    setServicosVeiculo(nextServicos);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, nextServicos);
  };

  const quickAddPlaca = (placaTexto, tipo = "cavalo") => {
    const placa = placaTexto.trim().toUpperCase();
    if (!placa) return null;
    const existente = trucks.find((t) => t.placa.toUpperCase() === placa);
    if (existente) return existente.id;
    const novoCaminhao = { id: uid(), placa, tipo };
    const nextTrucks = [...trucks, novoCaminhao];
    setTrucks(nextTrucks);
    persist(nextTrucks, trips);
    return novoCaminhao.id;
  };

  // lista de placas que podem ser selecionadas como cavalo (viagens, filtro de
  // frota, troca de óleo, abastecimento etc) — carretas ficam de fora daqui
  const trucksCavalos = useMemo(() => trucks.filter((t) => t.tipo !== "carreta"), [trucks]);
  const trucksCarretas = useMemo(() => trucks.filter((t) => t.tipo === "carreta"), [trucks]);

  const addSemParar = (caminhaoId, dataVencimento, valorPedagio, valePedagio, credito, observacao) => {
    const nextSemParar = [...semParar, { id: uid(), caminhaoId, dataVencimento, valorPedagio, valePedagio, credito, observacao }];
    setSemParar(nextSemParar);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, nextSemParar);
  };

  const updateSemParar = (id, caminhaoId, dataVencimento, valorPedagio, valePedagio, credito, observacao) => {
    const nextSemParar = semParar.map((s) => (s.id === id ? { ...s, caminhaoId, dataVencimento, valorPedagio, valePedagio, credito, observacao } : s));
    setSemParar(nextSemParar);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, nextSemParar);
  };

  const deleteSemParar = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este lançamento do Sem Parar?")) return;
    const nextSemParar = semParar.filter((s) => s.id !== id);
    setSemParar(nextSemParar);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, nextSemParar);
  };

  const deleteSeguro = (id) => {
    const s = seguro.find((x) => x.id === id);
    if (!s) return;

    if (!s.confirmado) {
      if (!window.confirm("Tem certeza que deseja excluir este lançamento de seguro?")) return;
      const nextSeguro = seguro.filter((x) => x.id !== id);
      setSeguro(nextSeguro);
      persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, nextSeguro);
      return;
    }

    // esse lançamento já confirmado tem uma despesa vinculada (sempre só dele) e até
    // dois boletos vinculados (cavalo e carreta podem ser de seguradoras diferentes,
    // logo boletos diferentes). Cada boleto só é removido de vez se não sobrar mais
    // nenhuma outra placa usando ele; senão, só desconta o valor dessa placa/lado.
    const contribuicaoPorBoleto = {};
    if (s.boletoIdCavalo) {
      contribuicaoPorBoleto[s.boletoIdCavalo] = (contribuicaoPorBoleto[s.boletoIdCavalo] || 0) + (Number(s.cavaloValor) || 0);
    }
    if (s.boletoIdCarreta) {
      contribuicaoPorBoleto[s.boletoIdCarreta] = (contribuicaoPorBoleto[s.boletoIdCarreta] || 0) + (Number(s.carretaValor) || 0);
    }
    const temBoletoVinculado = Object.keys(contribuicaoPorBoleto).length > 0;

    const aviso = temBoletoVinculado
      ? "Esse lançamento já foi confirmado. Excluir vai remover a despesa gerada, e vai remover (ou, se o boleto tiver outra placa junto, só descontar o valor dessa) o(s) boleto(s) vinculados. Excluir mesmo assim?"
      : "Esse lançamento já foi confirmado, mas não tem boleto vinculado (dado antigo). Excluir vai remover a despesa gerada. Excluir mesmo assim?";
    if (!window.confirm(aviso)) return;

    const nextSeguro = seguro.filter((x) => x.id !== id);
    const nextDespesas = despesasVeiculo.filter((d) => d.origemSeguroId !== id);

    let nextBoletos = boletos;
    Object.entries(contribuicaoPorBoleto).forEach(([boletoId, valorContribuido]) => {
      const aindaUsadoPorOutros = seguro.some(
        (x) => x.id !== id && (x.boletoIdCavalo === boletoId || x.boletoIdCarreta === boletoId)
      );
      if (aindaUsadoPorOutros) {
        nextBoletos = nextBoletos.map((b) =>
          b.id === boletoId ? { ...b, valor: Math.max(0, (Number(b.valor) || 0) - valorContribuido).toFixed(2) } : b
        );
      } else {
        nextBoletos = nextBoletos.filter((b) => b.id !== boletoId);
      }
    });

    setSeguro(nextSeguro);
    setDespesasVeiculo(nextDespesas);
    setBoletos(nextBoletos);
    persist(trucks, trips, vales, nextBoletos, empresas, fechamentos, nextDespesas, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, nextSeguro);
  };

  const addSemPararOutro = (data, valor, observacao) => {
    const nextOutros = [...semPararOutros, { id: uid(), data, valor, observacao }];
    setSemPararOutros(nextOutros);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, seguro, nextOutros);
  };

  const updateSemPararOutro = (id, data, valor, observacao) => {
    const nextOutros = semPararOutros.map((s) => (s.id === id ? { ...s, data, valor, observacao } : s));
    setSemPararOutros(nextOutros);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, seguro, nextOutros);
  };

  // pra corrigir lançamentos antigos (de antes de existir esse controle de
  // confirmado) que já tinham sido pagos/gerados de outro jeito — marca como já
  // confirmado sem gerar boleto nem despesa nova
  const marcarSemPararOutroConfirmado = (id) => {
    if (!window.confirm("Marcar essa arrecadação como já confirmada, sem gerar nenhum boleto/despesa novo? Use isso só se ela já tiver sido paga/lançada de outra forma antes.")) return;
    const nextOutros = semPararOutros.map((o) => (o.id === id ? { ...o, confirmado: true } : o));
    setSemPararOutros(nextOutros);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, seguro, nextOutros);
  };

  const marcarSemPararConfirmado = (id) => {
    if (!window.confirm("Marcar essa placa como já confirmada nessa remessa, sem gerar nenhum boleto/despesa novo? Use isso só se ela já tiver sido paga/lançada de outra forma antes.")) return;
    const nextSemParar = semParar.map((s) => (s.id === id ? { ...s, confirmado: true } : s));
    setSemParar(nextSemParar);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, nextSemParar);
  };

  const deleteSemPararOutro = (id) => {
    const o = semPararOutros.find((x) => x.id === id);
    const aviso = o && o.confirmado
      ? "Essa arrecadação já foi confirmada (já entrou num boleto/despesa). Excluir aqui NÃO remove o boleto nem a despesa já lançados. Excluir mesmo assim?"
      : "Tem certeza que deseja excluir esta arrecadação?";
    if (!window.confirm(aviso)) return;
    const nextOutros = semPararOutros.filter((s) => s.id !== id);
    setSemPararOutros(nextOutros);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, seguro, nextOutros);
  };

  const confirmarFinanceiroSemParar = () => {
    const doPeriodo = semParar.filter((s) => s.dataVencimento >= semPararPeriodStart && s.dataVencimento <= semPararPeriodEnd);
    const outrosDoPeriodo = semPararOutros.filter((o) => o.data >= semPararPeriodStart && o.data <= semPararPeriodEnd);
    if (doPeriodo.length === 0 && outrosDoPeriodo.length === 0) {
      alert("Nenhum lançamento nesse período pra confirmar.");
      return;
    }

    // só processa o que ainda NÃO foi confirmado — remessas já confirmadas antes
    // (mesmo estando dentro do período selecionado) ficam de fora, pra não gerar
    // boleto/despesa duplicado
    const pendentes = doPeriodo.filter((s) => !s.confirmado);
    const outrosPendentes = outrosDoPeriodo.filter((o) => !o.confirmado);
    if (pendentes.length === 0 && outrosPendentes.length === 0) {
      alert("Tudo que está nesse período já foi confirmado antes. Não tem remessa nova pra gerar financeiro.");
      return;
    }

    // cada remessa (data de vencimento) vira um boleto e uma despesa própria,
    // já que cada uma corresponde a uma fatura diferente de verdade
    const datasComPendencia = Array.from(new Set([
      ...pendentes.map((s) => s.dataVencimento),
      ...outrosPendentes.map((o) => o.data),
    ])).sort();

    const resumoConfirm = datasComPendencia.map((data) => {
      const itensPlaca = pendentes.filter((s) => s.dataVencimento === data);
      const itensOutros = outrosPendentes.filter((o) => o.data === data);
      const totalReal = itensPlaca.reduce((s, x) => s + (Number(x.valorPedagio) || 0) - (Number(x.credito) || 0), 0)
        + itensOutros.reduce((s, o) => s + (Number(o.valor) || 0), 0);
      return `Vencimento ${fmtDate(data)}: ${BRL(totalReal)}`;
    }).join("\n");
    const totalGeralPendente = datasComPendencia.reduce((soma, data) => {
      const itensPlaca = pendentes.filter((s) => s.dataVencimento === data);
      const itensOutros = outrosPendentes.filter((o) => o.data === data);
      return soma + itensPlaca.reduce((s, x) => s + (Number(x.valorPedagio) || 0) - (Number(x.credito) || 0), 0)
        + itensOutros.reduce((s, o) => s + (Number(o.valor) || 0), 0);
    }, 0);

    if (!window.confirm(`Confirmar ${datasComPendencia.length} remessa${datasComPendencia.length > 1 ? "s" : ""} do Sem Parar pendente${datasComPendencia.length > 1 ? "s" : ""}?\n\n${resumoConfirm}\n\nTotal: ${BRL(totalGeralPendente)}\n\nIsso vai criar um boleto separado por remessa em "Boletos", e lançar a despesa correspondente em cada caminhão (entra no líquido mensal).`)) return;

    // usa o nome exato da empresa que já estiver cadastrada (se existir), senão
    // cria uma nova já em maiúscula — assim não corre risco de duplicar por causa
    // de uma grafia diferente (ex: "Sem Parar" vs "SEM PARAR")
    const empresaExistente = empresas.find((e) => e.nome.toLowerCase() === "sem parar");
    const nomeEmpresa = empresaExistente ? empresaExistente.nome : "SEM PARAR";
    let nextEmpresas = empresaExistente
      ? empresas
      : [...empresas, { id: uid(), nome: nomeEmpresa, categoria: "Despesas Operacionais" }];

    const novosBoletos = [];
    const novasDespesas = [];
    datasComPendencia.forEach((data) => {
      const itensPlaca = pendentes.filter((s) => s.dataVencimento === data);
      const itensOutros = outrosPendentes.filter((o) => o.data === data);

      const porPlacaMapReal = {};
      itensPlaca.forEach((s) => {
        const total = (Number(s.valorPedagio) || 0) - (Number(s.credito) || 0);
        porPlacaMapReal[s.caminhaoId] = (porPlacaMapReal[s.caminhaoId] || 0) + total;
      });
      const totalOutrosRemessa = itensOutros.reduce((s, o) => s + (Number(o.valor) || 0), 0);
      // o boleto (o que você realmente paga pro Sem Parar) usa o valor real de cada
      // placa, mesmo que alguma dê negativa e "ajude" a pagar outra — é assim que a
      // fatura de verdade funciona
      const totalRemessa = Object.values(porPlacaMapReal).reduce((s, v) => s + v, 0) + totalOutrosRemessa;

      novosBoletos.push({
        id: uid(),
        empresa: nomeEmpresa,
        notaFiscal: "",
        valor: totalRemessa.toFixed(2),
        dataVencimento: data,
        contaBancaria: "",
        dataPagamento: "",
        observacao: `Sem Parar — vencimento ${fmtDate(data)}`,
      });

      // já a despesa lançada em cada placa (que entra no líquido do relatório mensal)
      // nunca fica negativa — se o crédito for maior que o pedágio dela, a despesa
      // dessa placa fica R$ 0,00 nesse período, sem "sobrar" pra nenhuma outra
      Object.entries(porPlacaMapReal).forEach(([caminhaoId, valor]) => {
        novasDespesas.push({
          id: uid(),
          caminhaoId,
          data,
          descricao: "Sem Parar",
          valor: Math.max(0, valor).toFixed(2),
          observacao: `Vencimento ${fmtDate(data)}`,
        });
      });
    });

    const nextBoletos = [...boletos, ...novosBoletos];
    const nextDespesas = [...despesasVeiculo, ...novasDespesas];

    const idsPendentes = new Set(pendentes.map((s) => s.id));
    const nextSemParar = semParar.map((s) => (idsPendentes.has(s.id) ? { ...s, confirmado: true } : s));
    const idsOutrosPendentes = new Set(outrosPendentes.map((o) => o.id));
    const nextSemPararOutros = semPararOutros.map((o) => (idsOutrosPendentes.has(o.id) ? { ...o, confirmado: true } : o));

    setEmpresas(nextEmpresas);
    setBoletos(nextBoletos);
    setDespesasVeiculo(nextDespesas);
    setSemParar(nextSemParar);
    setSemPararOutros(nextSemPararOutros);
    persist(trucks, trips, vales, nextBoletos, nextEmpresas, fechamentos, nextDespesas, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, nextSemParar, seguro, nextSemPararOutros);
    alert(`Confirmado! ${novosBoletos.length} boleto${novosBoletos.length > 1 ? "s" : ""} (um por remessa) apareceu em Boletos, e a despesa entrou no líquido mensal de cada caminhão.`);
  };

  const addTruck = () => {
    const placa = newPlate.trim().toUpperCase();
    if (!placa) return;
    const next = [...trucks, { id: uid(), placa, tipo: "cavalo" }];
    setTrucks(next);
    persist(next, trips);
    setNewPlate("");
    setAddingTruck(false);
  };

  const removeTruck = (id) => {
    const placa = trucks.find((t) => t.id === id)?.placa || "esse caminhão";
    const temViagens = trips.some((t) => t.caminhaoId === id);
    const mensagem = temViagens
      ? `Tem certeza que deseja remover a placa ${placa}? Ela tem viagens lançadas — elas continuam guardadas, só ficam sem placa vinculada.`
      : `Tem certeza que deseja remover a placa ${placa}?`;
    if (!window.confirm(mensagem)) return;
    const next = trucks.filter((t) => t.id !== id);
    setTrucks(next);
    persist(next, trips);
    if (filterTruck === id) setFilterTruck("all");
  };

  const toggleSemAlertaOleo = (id) => {
    const next = trucks.map((t) => (t.id === id ? { ...t, semAlertaOleo: !t.semAlertaOleo } : t));
    setTrucks(next);
    persist(next, trips);
  };

  const setIntervaloOleoCaminhao = (id, valor) => {
    const next = trucks.map((t) => (t.id === id ? { ...t, intervaloOleoKm: valor } : t));
    setTrucks(next);
    persist(next, trips);
  };

  // pra quando uma placa de carreta escapou da correção automática (ex: nunca foi
  // usada num lançamento de Seguro) — permite marcar/desmarcar manualmente
  const alternarTipoPlaca = (id) => {
    const next = trucks.map((t) => (t.id === id ? { ...t, tipo: t.tipo === "carreta" ? "cavalo" : "carreta" } : t));
    setTrucks(next);
    persist(next, trips);
  };

  const updateTruckInfo = (id, campos) => {
    const next = trucks.map((t) => (t.id === id ? { ...t, ...campos } : t));
    setTrucks(next);
    persist(next, trips);
  };

  const abrirConfiguracoes = () => {
    setConfigPercentualEdit(String(CONFIG_PERCENTUAL_COMISSAO));
    setConfigIntervaloOleoEdit(String(CONFIG_INTERVALO_OLEO_KM));
    // clona pra não editar o array global direto antes de salvar
    setConfigRegrasVencimentoEdit(CONFIG_REGRAS_VENCIMENTO_SEGURO.map((r) => ({ ...r })));
    setConfigOpen(true);
  };

  // define, troca ou remove a senha extra do app (fica salva na aba Config,
  // e é conferida só aqui no navegador — não é uma senha "de banco", mas já
  // trava alguém pegando o computador/iPad já logado no Google e abrindo
  // o sistema direto sem saber a senha)
  const salvarSenhaApp = (novaSenha) => {
    const nextConfig = [
      ...config.filter((c) => c.chave !== "senhaApp"),
      ...(novaSenha ? [{ chave: "senhaApp", valor: novaSenha }] : []),
    ];
    setConfig(nextConfig);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, seguro, semPararOutros, nextConfig);
  };

  const salvarConfiguracoes = () => {
    const percentual = Number(configPercentualEdit);
    const intervalo = Number(configIntervaloOleoEdit);
    if (!(percentual > 0)) {
      alert("Preencha uma porcentagem de comissão válida.");
      return;
    }
    if (!(intervalo > 0)) {
      alert("Preencha um km de troca de óleo válido.");
      return;
    }
    const regrasValidas = configRegrasVencimentoEdit.filter((r) => r.seguradora.trim() && r.dia >= 1 && r.dia <= 31);
    const nextConfig = [
      ...config.filter((c) => c.chave !== "percentualComissao" && c.chave !== "intervaloOleoKm" && c.chave !== "regrasVencimentoSeguro"),
      { chave: "percentualComissao", valor: String(percentual) },
      { chave: "intervaloOleoKm", valor: String(intervalo) },
      { chave: "regrasVencimentoSeguro", valor: JSON.stringify(regrasValidas) },
    ];
    CONFIG_PERCENTUAL_COMISSAO = percentual;
    CONFIG_INTERVALO_OLEO_KM = intervalo;
    CONFIG_REGRAS_VENCIMENTO_SEGURO = regrasValidas.map((r) => ({ ...r, seguradora: r.seguradora.trim().toUpperCase() }));
    setConfig(nextConfig);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, seguro, semPararOutros, nextConfig);
    setConfigOpen(false);
  };

  const adicionarRegraVencimento = () => {
    setConfigRegrasVencimentoEdit((prev) => [...prev, { seguradora: "", dia: 15, antecipaFimDeSemana: true }]);
  };

  const removerRegraVencimento = (index) => {
    setConfigRegrasVencimentoEdit((prev) => prev.filter((_, i) => i !== index));
  };

  const atualizarRegraVencimento = (index, campo, valor) => {
    setConfigRegrasVencimentoEdit((prev) => prev.map((r, i) => (i === index ? { ...r, [campo]: valor } : r)));
  };

  const [motoristaCustomMode, setMotoristaCustomMode] = useState(false);

  const openNewTrip = () => {
    if (trucksCavalos.length === 0) {
      alert("Cadastre um caminhão primeiro.");
      return;
    }
    setEditing(emptyTrip());
    setMotoristaCustomMode(false);
    setTripTravada(false);
    setPanelOpen(true);
  };

  const openEditTrip = (trip) => {
    setEditing({ ...trip });
    setMotoristaCustomMode(false);
    // qualquer viagem já lançada/salva abre travada — precisa clicar em "Editar
    // viagem" lá embaixo pra destravar e poder mexer
    setTripTravada(true);
    setPanelOpen(true);
  };

  // fecha o painel de edição de viagem — se ele foi aberto a partir do
  // relatório de Consumo (pra corrigir um km faltando), reabre o relatório
  // em seguida, em vez de deixar a pessoa ter que abrir tudo de novo
  const fecharPainelViagem = () => {
    setPanelOpen(false);
    setEditing(null);
    if (reabrirConsumoAoFecharViagem) {
      setReabrirConsumoAoFecharViagem(false);
      setRelatorioConsumoOpen(true);
    }
  };

  const saveTrip = () => {
    if (!editing.caminhaoId || !editing.data) {
      alert("Selecione o caminhão e a data da viagem.");
      return;
    }
    if (Number(editing.carregamento) > 0 && !editing.carregamentoMotorista) {
      alert("Selecione quem é o motorista do carregamento (ou zere o valor do carregamento).");
      return;
    }
    if (editing.motorista && editing.motorista.trim() && !motoristasList.includes(editing.motorista.trim())) {
      addMotorista(editing.motorista.trim());
    }
    if (editing.carregamentoMotorista && editing.carregamentoMotorista.trim() && !motoristasList.includes(editing.carregamentoMotorista.trim())) {
      addMotorista(editing.carregamentoMotorista.trim());
    }

    // gastos extras marcados com "gerar boleto" viram um boleto pendente
    // pra empresa escolhida — só nessa hora (uma vez só); depois de gerado,
    // a caixinha "gerar boleto" desmarca sozinha, pra não duplicar o boleto
    // se a viagem for salva de novo mais tarde
    const novosBoletosDeServico = (editing.gastosExtras || [])
      .filter((g) => g.importante && g.empresa && g.gerarBoleto && g.vencimentoBoleto && Number(g.valor) > 0)
      .map((g) => ({
        id: uid(),
        empresa: g.empresa,
        descricao: g.descricao || "Serviço no caminhão",
        notaFiscal: "",
        valor: g.valor,
        dataVencimento: g.vencimentoBoleto,
        contaBancaria: "",
        dataPagamento: "",
        observacao: `Gerado automaticamente a partir de gasto extra da viagem de ${fmtDate(editing.data)}`,
        desconto: "",
        descontoDescricao: "",
        juros: "",
        baixas: [],
        codigoBarras: "",
        linhaDigitavel: "",
        novoVencimento: "",
      }));
    const editingComGastosAjustados = {
      ...editing,
      gastosExtras: (editing.gastosExtras || []).map((g) => (g.gerarBoleto ? { ...g, gerarBoleto: false } : g)),
    };

    const exists = trips.some((t) => t.id === editingComGastosAjustados.id);
    const next = exists
      ? trips.map((t) => (t.id === editingComGastosAjustados.id ? editingComGastosAjustados : t))
      : [...trips, editingComGastosAjustados];
    setTrips(next);
    const nextBoletos = novosBoletosDeServico.length > 0 ? [...boletos, ...novosBoletosDeServico] : boletos;
    if (novosBoletosDeServico.length > 0) {
      setBoletos(nextBoletos);
    }

    // sincroniza reembolsos automaticos a partir dos abastecimentos marcados, dos
    // gastos extras marcados, e do carregamento (quando outro motorista carrega e
    // recebe por isso — o valor sai da comissão de quem está lançando a viagem e
    // vira um reembolso pro outro). Se a viagem estiver marcada como "comissão já
    // paga" (lançamento antigo, pago fora do sistema), nenhum reembolso novo é
    // gerado — nem do abastecimento, nem do gasto extra, nem do carregamento —
    // já que tudo dessa viagem já foi acertado.
    const origemCarregamentoMarker = `carregamento-${editing.id}`;
    const gastoIdsDestaViagem = (editing.gastosExtras || []).map((g) => g.id);
    const abastecimentoIdsDestaViagem = (editing.abastecimentos || []).map((a) => a.id);
    const idsParaLimpar = [...gastoIdsDestaViagem, ...abastecimentoIdsDestaViagem, origemCarregamentoMarker];
    const valesSemOsAntigosDestaViagem = vales.filter((v) => !idsParaLimpar.includes(v.origemGastoId));
    const novosReembolsosGastos = editing.comissaoJaPaga
      ? []
      : (editing.gastosExtras || [])
          .filter((g) => g.paraComissao && Number(g.valor) > 0 && editing.motorista)
          .map((g) => ({
            id: uid(),
            motorista: editing.motorista,
            data: g.data || editing.data,
            valor: g.valor,
            tipo: "reembolso",
            observacao: g.descricao ? `${g.descricao} (gasto da viagem)` : "Gasto extra da viagem",
            origemGastoId: g.id,
          }));
    const novosReembolsosAbastecimentos = editing.comissaoJaPaga
      ? []
      : (editing.abastecimentos || [])
          .filter((a) => a.paraComissao && Number(a.valor) > 0 && editing.motorista)
          .map((a) => ({
            id: uid(),
            motorista: editing.motorista,
            data: a.data || editing.data,
            valor: a.valor,
            tipo: "reembolso",
            observacao: `Abastecimento${a.posto ? ` — ${a.posto}` : ""} (gasto da viagem)`,
            origemGastoId: a.id,
          }));
    const novoReembolsoCarregamento = (!editing.comissaoJaPaga && Number(editing.carregamento) > 0 && editing.carregamentoMotorista)
      ? [{
          id: uid(),
          motorista: editing.carregamentoMotorista,
          data: editing.data,
          valor: editing.carregamento,
          tipo: "reembolso",
          observacao: `Carregamento — viagem ${truckLabel(editing.caminhaoId)} de ${editing.origem || "?"} a ${editing.destino || "?"} (${fmtDate(editing.data)})`,
          origemGastoId: origemCarregamentoMarker,
        }]
      : [];
    const nextVales = [...valesSemOsAntigosDestaViagem, ...novosReembolsosGastos, ...novosReembolsosAbastecimentos, ...novoReembolsoCarregamento];
    setVales(nextVales);

    persist(trucks, next, nextVales, nextBoletos);
    fecharPainelViagem();
  };

  const deleteTrip = (id) => {
    if (!window.confirm("Excluir esta viagem?")) return;
    const trip = trips.find((t) => t.id === id);
    const next = trips.filter((t) => t.id !== id);
    setTrips(next);
    if (trip) {
      const gastoIds = [
        ...(trip.gastosExtras || []).map((g) => g.id),
        ...(trip.abastecimentos || []).map((a) => a.id),
        `carregamento-${trip.id}`,
      ];
      const nextVales = vales.filter((v) => !gastoIds.includes(v.origemGastoId));
      setVales(nextVales);
      persist(trucks, next, nextVales);
    } else {
      persist(trucks, next);
    }
    fecharPainelViagem();
  };

  const [tripListStatusFilter, setTripListStatusFilter] = useState("all"); // all | pendente | pago
  const [tripListSortBy, setTripListSortBy] = useState("data"); // data | lancamento
  const [tripListPeriodFilter, setTripListPeriodFilter] = useState("all"); // all | mes | hoje | escolher
  const [tripListMesEscolhido, setTripListMesEscolhido] = useState(() => new Date().toISOString().slice(0, 7));

  const isTripPago = (t) => (t.dataRecebAdiantamento || !t.adiantamento) && (t.dataPagamentoSaldo || !(Number(t.saldoReceber) > 0));

  const visibleTrips = useMemo(() => {
    const list = filterTruck === "all" ? trips : trips.filter((t) => t.caminhaoId === filterTruck);
    return [...list].sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  }, [trips, filterTruck]);

  // viagens da placa selecionada dentro do período escolhido (Tudo/Este mês/Hoje/
  // Escolher mês) — usado tanto na lista quanto no cartão "Recebido"
  const tripsNoPeriodo = useMemo(() => {
    let list = visibleTrips;
    if (tripListPeriodFilter === "mes") {
      const mesAtual = todayISO().slice(0, 7);
      list = list.filter((t) => (t.data || "").slice(0, 7) === mesAtual);
    } else if (tripListPeriodFilter === "hoje") {
      const hojeISO = todayISO();
      list = list.filter((t) => t.data === hojeISO);
    } else if (tripListPeriodFilter === "escolher" && tripListMesEscolhido) {
      list = list.filter((t) => (t.data || "").slice(0, 7) === tripListMesEscolhido);
    }
    return list;
  }, [visibleTrips, tripListPeriodFilter, tripListMesEscolhido]);

  // lista exibida na tela de Viagens — igual a tripsNoPeriodo, só que com o
  // filtro de status/ordenação escolhidos por cima
  const [tripSearchQuery, setTripSearchQuery] = useState("");

  const tripsParaExibir = useMemo(() => {
    let list = tripsNoPeriodo;
    if (tripListStatusFilter === "pendente") list = list.filter((t) => !isTripPago(t));
    else if (tripListStatusFilter === "pago") list = list.filter((t) => isTripPago(t));
    const buscaNormalizada = tripSearchQuery.trim().toLowerCase();
    if (buscaNormalizada) {
      list = list.filter((t) =>
        (t.origem || "").toLowerCase().includes(buscaNormalizada) ||
        (t.destino || "").toLowerCase().includes(buscaNormalizada) ||
        (t.motorista || "").toLowerCase().includes(buscaNormalizada) ||
        (t.empresa || "").toLowerCase().includes(buscaNormalizada) ||
        (t.contrato || "").toLowerCase().includes(buscaNormalizada)
      );
    }
    if (tripListSortBy === "lancamento") {
      // ordem de lançamento = ordem em que foram cadastradas (o id guarda o
      // instante da criação), da mais recente pra mais antiga
      return [...list].sort((a, b) => (b.id || "").localeCompare(a.id || ""));
    }
    return list;
  }, [tripsNoPeriodo, tripListStatusFilter, tripListSortBy, tripSearchQuery]);

  const stats = useMemo(() => {
    // "a receber" sempre olha o total geral da placa, independente do período
    // escolhido na lista — mas "recebido" acompanha o período selecionado
    const totalReceber = visibleTrips.reduce(
      (s, t) => s + (t.dataPagamentoSaldo ? 0 : Number(t.saldoReceber) || 0) + (t.dataRecebAdiantamento ? 0 : Number(t.adiantamento) || 0),
      0
    );
    const totalRecebido = tripsNoPeriodo.reduce(
      (s, t) => s + (t.dataRecebAdiantamento ? Number(t.adiantamento) || 0 : 0) + (t.dataPagamentoSaldo ? Number(t.saldoReceber) || 0 : 0),
      0
    );
    return { count: visibleTrips.length, totalReceber, totalRecebido };
  }, [visibleTrips, tripsNoPeriodo]);

  const pendingList = useMemo(() => {
    return visibleTrips
      .map((t) => {
        const pendAdiantamento = t.dataRecebAdiantamento ? 0 : Number(t.adiantamento) || 0;
        const pendSaldo = t.dataPagamentoSaldo ? 0 : Number(t.saldoReceber) || 0;
        // se não tem nem adiantamento nem saldo lançado ainda (contrato ainda não
        // chegou), a viagem entra mesmo assim, zerada — pra não sumir de "a
        // receber" só porque o valor ainda não foi preenchido
        const semValorPreenchido = !(Number(t.adiantamento) > 0) && !(Number(t.saldoReceber) > 0);
        return { trip: t, pendAdiantamento, pendSaldo, pendTotal: pendAdiantamento + pendSaldo, semValorPreenchido };
      })
      .filter((r) => r.pendTotal > 0 || r.semValorPreenchido)
      .sort((a, b) => (a.trip.data || "").localeCompare(b.trip.data || ""));
  }, [visibleTrips]);

  const receivedList = useMemo(() => {
    const rows = [];
    tripsNoPeriodo.forEach((t) => {
      if (t.dataRecebAdiantamento && Number(t.adiantamento) > 0) {
        rows.push({ trip: t, tipo: "Adiantamento", valor: Number(t.adiantamento) || 0, data: t.dataRecebAdiantamento });
      }
      if (t.dataPagamentoSaldo && Number(t.saldoReceber) > 0) {
        rows.push({ trip: t, tipo: "Saldo", valor: Number(t.saldoReceber) || 0, data: t.dataPagamentoSaldo });
      }
    });
    return rows.sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  }, [tripsNoPeriodo]);

  // relatório de recebimento — período e caminhão próprios, independentes dos
  // filtros da lista de viagens. Mostra cada contrato recebido (adiantamento
  // e/ou saldo) dentro do período, na data em que entrou o dinheiro
  const relatorioRecebimento = useMemo(() => {
    const rows = [];
    trips.forEach((t) => {
      if (recebimentoCaminhaoFiltro !== "all" && t.caminhaoId !== recebimentoCaminhaoFiltro) return;
      if (t.dataRecebAdiantamento && Number(t.adiantamento) > 0 && t.dataRecebAdiantamento >= recebimentoPeriodStart && t.dataRecebAdiantamento <= recebimentoPeriodEnd) {
        rows.push({ trip: t, tipo: "Adiantamento", valor: Number(t.adiantamento) || 0, data: t.dataRecebAdiantamento });
      }
      if (t.dataPagamentoSaldo && Number(t.saldoReceber) > 0 && t.dataPagamentoSaldo >= recebimentoPeriodStart && t.dataPagamentoSaldo <= recebimentoPeriodEnd) {
        rows.push({ trip: t, tipo: "Saldo", valor: Number(t.saldoReceber) || 0, data: t.dataPagamentoSaldo });
      }
    });
    const items = rows.sort((a, b) => (a.data || "").localeCompare(b.data || "") || (a.trip.contrato || "").localeCompare(b.trip.contrato || ""));
    const total = items.reduce((s, r) => s + r.valor, 0);
    return { items, total };
  }, [trips, recebimentoCaminhaoFiltro, recebimentoPeriodStart, recebimentoPeriodEnd]);

  const commissionByDriver = useMemo(() => {
    const fechamentosPorMotorista = {};
    fechamentos.forEach((f) => {
      const chave = normalizarNomeMotorista(f.motorista);
      if (!fechamentosPorMotorista[chave]) fechamentosPorMotorista[chave] = [];
      fechamentosPorMotorista[chave].push(f);
    });
    Object.values(fechamentosPorMotorista).forEach((arr) => arr.sort((a, b) => (a.data || "").localeCompare(b.data || "")));

    const groups = {};
    // a Comissão nunca filtra por placa — sempre mostra todos os motoristas de
    // todos os caminhões, independente de qual placa estiver selecionada lá em
    // cima, pra não correr risco de "esconder" o que algum motorista tem a receber
    trips.forEach((t) => {
      // comissão já paga fora do sistema (viagem antiga lançada só pro histórico
      // do relatório mensal) não entra aqui — ela não deve aparecer como "a
      // receber" nem no histórico de fechamento do motorista
      if (t.comissaoJaPaga) return;
      const val = comissao(t);
      // se não tem valor lançado ainda (nem base, nem fixo), a viagem entra mesmo
      // assim, zerada — pra não sumir da lista do motorista só porque ainda não
      // sabemos o valor. Se o valor foi lançado e o cálculo deu zero por outro
      // motivo (ex: pedágio cobre tudo), aí sim continua fora, como sempre foi.
      const semValorPreenchido = t.comissaoFixa ? !(Number(t.valorComissaoFixa) > 0) : !(Number(t.valorComissaoBase) > 0);
      if (val <= 0 && !semValorPreenchido) return;
      const key = t.motorista && t.motorista.trim() ? t.motorista.trim() : "Sem motorista definido";
      if (!groups[key]) groups[key] = { motorista: key, trips: [] };
      groups[key].trips.push({ trip: t, valor: val, semValorPreenchido });
    });
    vales.forEach((v) => {
      if (!groups[v.motorista]) groups[v.motorista] = { motorista: v.motorista, trips: [] };
    });
    Object.keys(fechamentosPorMotorista).forEach((chave) => {
      const jaExiste = Object.keys(groups).some((m) => normalizarNomeMotorista(m) === chave);
      if (!jaExiste) {
        // pega o nome mais recente usado nesse conjunto de fechamentos, pra exibir bonitinho
        const nomeExibicao = fechamentosPorMotorista[chave][fechamentosPorMotorista[chave].length - 1].motorista;
        groups[nomeExibicao] = { motorista: nomeExibicao, trips: [] };
      }
    });

    return Object.values(groups)
      .map((g) => {
        const historico = fechamentosPorMotorista[normalizarNomeMotorista(g.motorista)] || [];

        // uma viagem/vale só conta como "já fechado" se ela realmente tiver sido
        // capturada num fechamento (por id). Fechamentos antigos, feitos antes dessa
        // correção, não guardaram essa lista — pra eles, segue valendo o corte por data,
        // do jeito que já funcionava.
        const tripIdsFechados = new Set();
        const valeIdsFechados = new Set();
        let legacyCutoffTrips = "";
        let legacyCutoffVales = "";
        historico.forEach((f) => {
          if (f.tripIds) f.tripIds.forEach((id) => tripIdsFechados.add(id));
          else if (!legacyCutoffTrips || f.data > legacyCutoffTrips) legacyCutoffTrips = f.data;
          if (f.valeIds) f.valeIds.forEach((id) => valeIdsFechados.add(id));
          else if (!legacyCutoffVales || f.data > legacyCutoffVales) legacyCutoffVales = f.data;
        });

        const tripsAtuais = g.trips.filter((tv) => !tripIdsFechados.has(tv.trip.id) && (tv.trip.data || "") > legacyCutoffTrips);
        const totalAtual = tripsAtuais.reduce((s, tv) => s + tv.valor, 0);

        const valesDoMotorista = vales
          .filter((v) => v.motorista === g.motorista)
          .sort((a, b) => (b.data || "").localeCompare(a.data || ""));
        const hojeISO = todayISO();
        const valesNoPeriodo = valesDoMotorista.filter((v) => !valeIdsFechados.has(v.id) && (v.data || "") > legacyCutoffVales);
        // só parcelas de repetição mensal ("agendado") ficam presas à data futura;
        // vales/reembolsos avulsos contam na hora, independente da data escolhida
        const valesAtuais = valesNoPeriodo.filter((v) => v.agendado !== "sim" || (v.data || "") <= hojeISO);
        const valesFuturos = valesNoPeriodo
          .filter((v) => v.agendado === "sim" && (v.data || "") > hojeISO)
          .sort((a, b) => (a.data || "").localeCompare(b.data || ""));
        const totalPago = valesAtuais.filter((v) => v.tipo !== "reembolso").reduce((s, v) => s + (Number(v.valor) || 0), 0);
        const totalReembolso = valesAtuais.filter((v) => v.tipo === "reembolso").reduce((s, v) => s + (Number(v.valor) || 0), 0);

        // monta o historico com os lançamentos de cada fechamento (janela entre o fechamento anterior e este)
        const historicoComItens = historico.map((f, idx) => {
          const inicioJanela = idx > 0 ? historico[idx - 1].data : "";
          const fimJanela = f.data;
          const tripsJanela = (f.tripIds
            ? g.trips.filter((tv) => f.tripIds.includes(tv.trip.id))
            : g.trips.filter((tv) => (tv.trip.data || "") > inicioJanela && (tv.trip.data || "") <= fimJanela)
          ).sort((a, b) => (a.trip.data || "").localeCompare(b.trip.data || ""));
          const valesJanela = (f.valeIds
            ? valesDoMotorista.filter((v) => f.valeIds.includes(v.id))
            : valesDoMotorista.filter((v) => (v.data || "") > inicioJanela && (v.data || "") <= fimJanela)
          ).sort((a, b) => (a.data || "").localeCompare(b.data || ""));
          // recalcula o valor sempre a partir dos lançamentos reais dessa janela —
          // nunca confia só no campo "valor" salvo na hora da criação, porque ele
          // fica desatualizado se alguém usar "ajustar lançamentos" depois
          const totalTripsJanela = tripsJanela.reduce((s, tv) => s + tv.valor, 0);
          const totalReembolsoJanela = valesJanela.filter((v) => v.tipo === "reembolso").reduce((s, v) => s + (Number(v.valor) || 0), 0);
          const totalPagoJanela = valesJanela.filter((v) => v.tipo !== "reembolso").reduce((s, v) => s + (Number(v.valor) || 0), 0);
          const valorRecalculado = totalTripsJanela + totalReembolsoJanela - totalPagoJanela;
          return { ...f, trips: tripsJanela, vales: valesJanela, valor: valorRecalculado };
        }).reverse();

        return {
          motorista: g.motorista,
          trips: tripsAtuais.sort((a, b) => (a.trip.data || "").localeCompare(b.trip.data || "")),
          vales: valesAtuais,
          valesFuturos,
          total: totalAtual,
          totalPago,
          totalReembolso,
          saldo: totalAtual + totalReembolso - totalPago,
          historico: historicoComItens,
        };
      })
      .sort((a, b) => b.saldo - a.saldo);
  }, [trips, vales, fechamentos]);

  const [historicoExpandido, setHistoricoExpandido] = useState({});
  const toggleHistorico = (motorista) => setHistoricoExpandido((prev) => ({ ...prev, [motorista]: !prev[motorista] }));

  const [fechandoMotorista, setFechandoMotorista] = useState(null);
  const [fechamentoDataEditavel, setFechamentoDataEditavel] = useState("");

  const startFecharSaldo = (motorista) => {
    setFechandoMotorista(motorista);
    setFechamentoDataEditavel(todayISO());
  };

  const confirmFecharSaldo = (valor, tripsAtuais, valesAtuais) => {
    const tripIds = tripsAtuais.map((tv) => tv.trip.id);
    const valeIds = valesAtuais.map((v) => v.id);
    const nextFechamentos = [...fechamentos, { id: uid(), motorista: fechandoMotorista, data: fechamentoDataEditavel, valor, tripIds, valeIds }];
    setFechamentos(nextFechamentos);
    persist(trucks, trips, vales, boletos, empresas, nextFechamentos);
    setFechandoMotorista(null);
  };

  const [editandoFechamentoId, setEditandoFechamentoId] = useState(null);
  const [editandoFechamentoData, setEditandoFechamentoData] = useState("");

  const startEditFechamentoData = (fechamento) => {
    setEditandoFechamentoId(fechamento.id);
    setEditandoFechamentoData(fechamento.data);
  };

  const confirmEditFechamentoData = (motorista) => {
    const nextFechamentos = fechamentos.map((f) =>
      f.id === editandoFechamentoId ? { ...f, data: editandoFechamentoData } : f
    );
    setFechamentos(nextFechamentos);
    persist(trucks, trips, vales, boletos, empresas, nextFechamentos);
    setEditandoFechamentoId(null);
  };

  // ferramenta de correção: um fechamento antigo pode ter "puxado" uma viagem/vale que na
  // verdade não foi pago ali (ex: viagem do mesmo dia do fechamento, sem valor na hora).
  // aqui dá pra desmarcar o que não devia estar naquele fechamento.
  const [ajustandoFechamentoId, setAjustandoFechamentoId] = useState(null);
  const [ajusteTripIds, setAjusteTripIds] = useState([]);
  const [ajusteValeIds, setAjusteValeIds] = useState([]);

  const startAjustarFechamento = (f) => {
    setAjustandoFechamentoId(f.id);
    setAjusteTripIds(f.trips.map((tv) => tv.trip.id));
    setAjusteValeIds(f.vales.map((v) => v.id));
  };

  const confirmAjustarFechamento = () => {
    const nextFechamentos = fechamentos.map((f) =>
      f.id === ajustandoFechamentoId ? { ...f, tripIds: ajusteTripIds, valeIds: ajusteValeIds } : f
    );
    setFechamentos(nextFechamentos);
    persist(trucks, trips, vales, boletos, empresas, nextFechamentos);
    setAjustandoFechamentoId(null);
  };

  const totalComissao = useMemo(() => commissionByDriver.reduce((s, g) => s + g.total, 0), [commissionByDriver]);
  // total geral: soma a comissão das viagens dentro do período/placa
  // selecionados na tela (igual ao resto do cartão) — antes somava TODAS as
  // viagens já lançadas, sem filtrar por período, o que dava um total bem
  // maior do que o esperado quando a pessoa escolhia "Este mês"
  const totalComissaoGeral = useMemo(
    () => tripsNoPeriodo.reduce((s, t) => s + comissao(t), 0),
    [tripsNoPeriodo]
  );
  // soma só o "saldo devido" (vermelho) de cada motorista — o que você ainda
  // precisa pagar pra cada um. Motorista que estiver com saldo negativo (te
  // devendo) conta como zero aqui, não desconta do total dos outros
  const totalSaldoDevido = useMemo(
    () => commissionByDriver.reduce((s, g) => s + Math.max(0, g.saldo), 0),
    [commissionByDriver]
  );
  const [comissaoCardModo, setComissaoCardModo] = useState("pendente"); // "pendente" | "geral" | "saldo"

  const [statsDetailOpen, setStatsDetailOpen] = useState(null); // null | "receber" | "recebido" | "comissao"
  const [alertasAbertos, setAlertasAbertos] = useState(false);
  const [alertaOleoAberto, setAlertaOleoAberto] = useState(false);
  const [addingValeFor, setAddingValeFor] = useState(null);
  const [editingValeId, setEditingValeId] = useState(null);
  const [commissionDriverFilter, setCommissionDriverFilter] = useState("all");
  const [valeData, setValeData] = useState("");
  const [valeValor, setValeValor] = useState("");
  const [valeTipo, setValeTipo] = useState("vale");
  const [valeObs, setValeObs] = useState("");
  const [valeRepetirMeses, setValeRepetirMeses] = useState("");

  const startAddVale = (motorista) => {
    setAddingValeFor(motorista);
    setEditingValeId(null);
    setValeData(new Date().toISOString().slice(0, 10));
    setValeValor("");
    setValeTipo("vale");
    setValeObs("");
    setValeRepetirMeses("");
  };

  const startEditVale = (v) => {
    setAddingValeFor(v.motorista);
    setEditingValeId(v.id);
    setValeData(v.data);
    setValeValor(v.valor || "");
    setValeTipo(v.tipo || "vale");
    setValeObs(v.observacao || "");
    setValeRepetirMeses("");
  };

  const addMesesISO = (isoDate, n) => {
    const [y, m, d] = isoDate.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setMonth(dt.getMonth() + n);
    return dt.toISOString().slice(0, 10);
  };

  const confirmAddVale = () => {
    if (!valeValor || Number(valeValor) <= 0) return;
    if (editingValeId) {
      updateVale(editingValeId, valeData, valeValor, valeTipo, valeObs);
      setAddingValeFor(null);
      setEditingValeId(null);
      return;
    }
    const qtd = Math.max(1, Number(valeRepetirMeses) || 1);
    if (qtd === 1) {
      addVale(addingValeFor, valeData, valeValor, valeTipo, valeObs);
    } else {
      const obsBase = valeObs ? `${valeObs} ` : "";
      const novos = Array.from({ length: qtd }, (_, i) => ({
        id: uid(),
        motorista: addingValeFor,
        data: i === 0 ? valeData : addMesesISO(valeData, i),
        valor: valeValor,
        tipo: valeTipo,
        observacao: `${obsBase}(parcela ${i + 1}/${qtd})`.trim(),
        agendado: "sim",
      }));
      addValesMultiple(novos);
    }
    setAddingValeFor(null);
  };

  const monthlyReport = useMemo(() => {
    const tripsInMonth = trips.filter((t) => (t.data || "").slice(0, 7) === reportMonth);
    const despesasInMonth = despesasVeiculo.filter((d) => (d.data || "").slice(0, 7) === reportMonth);
    const trucksFiltered = filterTruck === "all" ? trucksCavalos : trucksCavalos.filter((tr) => tr.id === filterTruck);
    const rows = trucksFiltered.map((tr) => {
      const tripsTruck = tripsInMonth.filter((t) => t.caminhaoId === tr.id);
      const receita = tripsTruck.reduce((s, t) => s + valorTotal(t), 0);
      const comissaoTotal = tripsTruck.reduce((s, t) => s + comissao(t), 0);
      // carregamento (troca de motorista) é um custo à parte, pago pro OUTRO
      // motorista — não é descontado do valor do carregamento em si, então
      // precisa entrar como sua própria despesa aqui, senão o líquido some com
      // esse valor sem ele aparecer em lugar nenhum
      const carregamentoTotal = tripsTruck.reduce((s, t) => s + (Number(t.carregamento) || 0), 0);
      const abastecimentoTotal = tripsTruck.reduce(
        (s, t) => s + t.abastecimentos.reduce((s2, a) => s2 + (Number(a.valor) || 0), 0),
        0
      );
      const gastosTotal = tripsTruck.reduce(
        (s, t) => s + t.gastosExtras.reduce((s2, g) => s2 + (Number(g.valor) || 0), 0),
        0
      );
      const despesasVeiculoTotal = despesasInMonth
        .filter((d) => d.caminhaoId === tr.id)
        .reduce((s, d) => s + (Number(d.valor) || 0), 0);
      const liquido = receita - comissaoTotal - carregamentoTotal - abastecimentoTotal - gastosTotal - despesasVeiculoTotal;
      // qual carreta andou vinculada a esse cavalo nesse mês, segundo os lançamentos de Seguro
      const placasCarretaDoMes = Array.from(new Set(
        seguro
          .filter((s) => s.mes === reportMonth && s.cavaloCaminhaoId === tr.id && s.carretaCaminhaoId)
          .map((s) => truckLabel(s.carretaCaminhaoId))
      ));
      return {
        id: tr.id,
        placa: tr.placa,
        carretaVinculada: placasCarretaDoMes.join(", "),
        viagens: tripsTruck.length,
        receita,
        comissaoTotal,
        carregamentoTotal,
        abastecimentoTotal,
        gastosTotal,
        despesasVeiculoTotal,
        liquido,
      };
    });
    const totals = rows.reduce(
      (acc, r) => ({
        viagens: acc.viagens + r.viagens,
        receita: acc.receita + r.receita,
        comissaoTotal: acc.comissaoTotal + r.comissaoTotal,
        carregamentoTotal: acc.carregamentoTotal + r.carregamentoTotal,
        abastecimentoTotal: acc.abastecimentoTotal + r.abastecimentoTotal,
        gastosTotal: acc.gastosTotal + r.gastosTotal,
        despesasVeiculoTotal: acc.despesasVeiculoTotal + r.despesasVeiculoTotal,
        liquido: acc.liquido + r.liquido,
      }),
      { viagens: 0, receita: 0, comissaoTotal: 0, carregamentoTotal: 0, abastecimentoTotal: 0, gastosTotal: 0, despesasVeiculoTotal: 0, liquido: 0 }
    );
    return { rows, totals };
  }, [trips, trucksCavalos, reportMonth, filterTruck, despesasVeiculo, seguro]);

  // igual ao monthlyReport, mas filtrando por um intervalo de datas qualquer
  // (não só um mês fechado) — usado no Dashboard, que precisa de mais
  // flexibilidade de período (hoje, semana, mês, tudo, ou um intervalo escolhido)
  const dashboardReport = useMemo(() => {
    const tripsNoPeriodo = trips.filter((t) => (t.data || "") >= dashboardPeriodStart && (t.data || "") <= dashboardPeriodEnd);
    const despesasNoPeriodo = despesasVeiculo.filter((d) => (d.data || "") >= dashboardPeriodStart && (d.data || "") <= dashboardPeriodEnd);
    const mesInicio = dashboardPeriodStart.slice(0, 7);
    const mesFim = dashboardPeriodEnd.slice(0, 7);
    const trucksFiltered = filterTruck === "all" ? trucksCavalos : trucksCavalos.filter((tr) => tr.id === filterTruck);
    const rows = trucksFiltered.map((tr) => {
      const tripsTruck = tripsNoPeriodo.filter((t) => t.caminhaoId === tr.id);
      const receita = tripsTruck.reduce((s, t) => s + valorTotal(t), 0);
      const comissaoTotal = tripsTruck.reduce((s, t) => s + comissao(t), 0);
      const carregamentoTotal = tripsTruck.reduce((s, t) => s + (Number(t.carregamento) || 0), 0);
      const abastecimentoTotal = tripsTruck.reduce(
        (s, t) => s + t.abastecimentos.reduce((s2, a) => s2 + (Number(a.valor) || 0), 0),
        0
      );
      const gastosTotal = tripsTruck.reduce(
        (s, t) => s + t.gastosExtras.reduce((s2, g) => s2 + (Number(g.valor) || 0), 0),
        0
      );
      const despesasVeiculoTotal = despesasNoPeriodo
        .filter((d) => d.caminhaoId === tr.id)
        .reduce((s, d) => s + (Number(d.valor) || 0), 0);
      const liquido = receita - comissaoTotal - carregamentoTotal - abastecimentoTotal - gastosTotal - despesasVeiculoTotal;
      const placasCarretaDoPeriodo = Array.from(new Set(
        seguro
          .filter((s) => s.mes >= mesInicio && s.mes <= mesFim && s.cavaloCaminhaoId === tr.id && s.carretaCaminhaoId)
          .map((s) => truckLabel(s.carretaCaminhaoId))
      ));
      return {
        id: tr.id,
        placa: tr.placa,
        carretaVinculada: placasCarretaDoPeriodo.join(", "),
        viagens: tripsTruck.length,
        receita,
        comissaoTotal,
        carregamentoTotal,
        abastecimentoTotal,
        gastosTotal,
        despesasVeiculoTotal,
        liquido,
      };
    });
    const totals = rows.reduce(
      (acc, r) => ({
        viagens: acc.viagens + r.viagens,
        receita: acc.receita + r.receita,
        comissaoTotal: acc.comissaoTotal + r.comissaoTotal,
        carregamentoTotal: acc.carregamentoTotal + r.carregamentoTotal,
        abastecimentoTotal: acc.abastecimentoTotal + r.abastecimentoTotal,
        gastosTotal: acc.gastosTotal + r.gastosTotal,
        despesasVeiculoTotal: acc.despesasVeiculoTotal + r.despesasVeiculoTotal,
        liquido: acc.liquido + r.liquido,
      }),
      { viagens: 0, receita: 0, comissaoTotal: 0, carregamentoTotal: 0, abastecimentoTotal: 0, gastosTotal: 0, despesasVeiculoTotal: 0, liquido: 0 }
    );
    return { rows, totals };
  }, [trips, trucksCavalos, dashboardPeriodStart, dashboardPeriodEnd, filterTruck, despesasVeiculo, seguro]);

  // Dashboard Geral: receita bruta - comissões - gastos extras (despesas
  // estrada) - boletos das categorias escolhidas (juros, financiamentos,
  // despesas de caminhão, seguros...) - taxa de viagem (rateio) = rendimento
  // líquido geral. Conta dinheiro que efetivamente saiu no período: cada
  // baixa parcial entra no mês em que ela foi feita, e o fechamento de um
  // boleto (quando ele fica realmente quitado) entra no mês da "Data de
  // pagamento" — assim um boleto pago aos poucos, em meses diferentes, é
  // dividido certinho entre os meses, em vez de cair tudo de uma vez só no
  // mês em que foi fechado
  const dashboardGeralReport = useMemo(() => {
    const tripsNoPeriodo = trips.filter((t) => (t.data || "") >= dashboardGeralPeriodStart && (t.data || "") <= dashboardGeralPeriodEnd);
    const receitaBruta = tripsNoPeriodo.reduce((s, t) => s + valorTotal(t), 0);
    const comissoes = tripsNoPeriodo.reduce((s, t) => s + comissao(t), 0);
    const gastosExtrasLista = [];
    tripsNoPeriodo.forEach((t) => {
      (t.gastosExtras || []).filter((g) => (g.categoria || "") === "Despesas Estrada" && (Number(g.valor) || 0) > 0.009).forEach((g) => {
        gastosExtrasLista.push({ data: t.data, caminhaoId: t.caminhaoId, empresa: t.empresa, motorista: t.motorista, descricao: g.descricao || "", valor: Number(g.valor) || 0 });
      });
    });
    const gastosExtrasEstrada = tripsNoPeriodo.reduce(
      (s, t) => s + (t.gastosExtras || []).filter((g) => (g.categoria || "") === "Despesas Estrada").reduce((s2, g) => s2 + (Number(g.valor) || 0), 0),
      0
    );
    const empresasPorCategoria = {};
    empresas.forEach((e) => { empresasPorCategoria[e.nome] = e.categoria; });
    const boletosPagos = [];
    boletos.forEach((b) => {
      const categoriaEmpresa = empresasPorCategoria[b.empresa];
      if (!categoriaEmpresa || !categoriasIncluidasDashboardGeral.includes(categoriaEmpresa)) return;
      eventosPagamentoBoleto(b).forEach((ev) => {
        if (ev.data >= dashboardGeralPeriodStart && ev.data <= dashboardGeralPeriodEnd) {
          boletosPagos.push({ ...b, dataEvento: ev.data, valorEvento: ev.valor, ehBaixaParcial: ev.tipo === "baixa" });
        }
      });
    });
    const boletosDespesa = boletosPagos.reduce((s, ev) => s + ev.valorEvento, 0);
    const taxaViagemLista = despesasVeiculo
      .filter((d) => (d.data || "") >= dashboardGeralPeriodStart && (d.data || "") <= dashboardGeralPeriodEnd && (d.descricao || "").startsWith("Taxa de viagem"));
    const taxaViagem = taxaViagemLista.reduce((s, d) => s + (Number(d.valor) || 0), 0);
    const rendimentoLiquidoGeral = receitaBruta - comissoes - gastosExtrasEstrada - boletosDespesa - taxaViagem;
    return {
      receitaBruta, comissoes, gastosExtrasEstrada, boletosDespesa, boletosPagos, taxaViagem, rendimentoLiquidoGeral,
      tripsNoPeriodo, gastosExtrasLista, taxaViagemLista,
    };
  }, [trips, boletos, empresas, despesasVeiculo, dashboardGeralPeriodStart, dashboardGeralPeriodEnd, categoriasIncluidasDashboardGeral]);


  // só pra visualização no Dashboard — quanto cada motorista GEROU de
  // comissão no período (sem olhar se já foi pago, fechado, ou tem vale
  // descontado). Não mexe em nada de fechamento/vale/pagamento, é só leitura
  const comissaoGeradaPorMotorista = useMemo(() => {
    const tripsNoPeriodo = trips.filter((t) => (t.data || "") >= dashboardPeriodStart && (t.data || "") <= dashboardPeriodEnd);
    const porMotorista = {};
    tripsNoPeriodo.forEach((t) => {
      const nome = t.motorista && t.motorista.trim() ? t.motorista.trim() : "Sem motorista definido";
      if (!porMotorista[nome]) porMotorista[nome] = { motorista: nome, viagens: 0, comissaoGerada: 0 };
      porMotorista[nome].viagens += 1;
      porMotorista[nome].comissaoGerada += comissao(t);
    });
    return Object.values(porMotorista).sort((a, b) => b.comissaoGerada - a.comissaoGerada);
  }, [trips, dashboardPeriodStart, dashboardPeriodEnd]);

  const despesasVeiculoDoMes = useMemo(() => {
    return despesasVeiculo
      .filter((d) => (d.data || "").slice(0, 7) === reportMonth)
      .sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  }, [despesasVeiculo, reportMonth]);

  const [addingDespesaFor, setAddingDespesaFor] = useState(null);
  const [editingDespesaId, setEditingDespesaId] = useState(null);
  const [despesaData, setDespesaData] = useState("");
  const [despesaDescricao, setDespesaDescricao] = useState("");
  const [despesaValor, setDespesaValor] = useState("");
  const [despesaObs, setDespesaObs] = useState("");

  const startAddDespesa = (caminhaoId) => {
    setAddingDespesaFor(caminhaoId);
    setEditingDespesaId(null);
    setDespesaData(new Date().toISOString().slice(0, 10));
    setDespesaDescricao("");
    setDespesaValor("");
    setDespesaObs("");
  };

  const startEditDespesa = (d) => {
    setAddingDespesaFor(d.caminhaoId);
    setEditingDespesaId(d.id);
    setDespesaData(d.data);
    setDespesaDescricao(d.descricao || "");
    setDespesaValor(d.valor || "");
    setDespesaObs(d.observacao || "");
  };

  const confirmAddDespesa = () => {
    if (!despesaDescricao.trim() || !despesaValor || Number(despesaValor) <= 0) return;
    if (editingDespesaId) {
      updateDespesaVeiculo(editingDespesaId, addingDespesaFor, despesaData, despesaDescricao.trim(), despesaValor, despesaObs);
    } else {
      addDespesaVeiculo(addingDespesaFor, despesaData, despesaDescricao.trim(), despesaValor, despesaObs);
    }
    setAddingDespesaFor(null);
    setEditingDespesaId(null);
  };

  const [addingTaxa, setAddingTaxa] = useState(false);
  const [editingTaxaId, setEditingTaxaId] = useState(null);
  const [taxaData, setTaxaData] = useState("");
  const [taxaValor, setTaxaValor] = useState("");
  const [taxaDescricao, setTaxaDescricao] = useState("");

  const startAddTaxa = () => {
    setAddingTaxa(true);
    setEditingTaxaId(null);
    setTaxaData(new Date().toISOString().slice(0, 10));
    setTaxaValor("");
    setTaxaDescricao("");
  };

  const startEditTaxa = (t) => {
    setAddingTaxa(true);
    setEditingTaxaId(t.id);
    setTaxaData(t.data);
    setTaxaValor(t.valor || "");
    setTaxaDescricao(t.descricao || "");
  };

  const confirmAddTaxa = () => {
    if (!taxaValor || Number(taxaValor) <= 0) return;
    if (editingTaxaId) {
      updateTaxaPool(editingTaxaId, reportMonth, taxaData, taxaValor, taxaDescricao.trim());
    } else {
      addTaxaPool(reportMonth, taxaData, taxaValor, taxaDescricao.trim());
    }
    setAddingTaxa(false);
    setEditingTaxaId(null);
  };

  const taxasDoMesReport = useMemo(() => {
    return taxasPool.filter((t) => t.mes === reportMonth).sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  }, [taxasPool, reportMonth]);

  const taxasDoMesTotal = useMemo(() => taxasDoMesReport.reduce((s, t) => s + (Number(t.valor) || 0), 0), [taxasDoMesReport]);

  const detailedReport = useMemo(() => {
    const tripsInMonth = trips.filter((t) => (t.data || "").slice(0, 7) === reportMonth);
    const despesasInMonth = despesasVeiculo.filter((d) => (d.data || "").slice(0, 7) === reportMonth);
    const trucksFiltered = filterTruck === "all" ? trucksCavalos : trucksCavalos.filter((tr) => tr.id === filterTruck);
    const groups = trucksFiltered
      .map((tr) => {
        const tripsTruck = tripsInMonth
          .filter((t) => t.caminhaoId === tr.id)
          .sort((a, b) => (a.data || "").localeCompare(b.data || ""));
        const tripRows = tripsTruck.map((t, idx) => {
          const expenses = [];
          const com = comissao(t);
          if (com > 0) {
            expenses.push({ data: t.data, tipo: "Comissão", descricao: t.motorista || "Comissão motorista", planoDeConta: "Comissão", valor: com });
          }
          if (Number(t.carregamento) > 0) {
            expenses.push({ data: t.data, tipo: "Carregamento", descricao: t.carregamentoMotorista ? `Carregamento — ${t.carregamentoMotorista}` : "Carregamento (troca de motorista)", planoDeConta: "Comissão", valor: Number(t.carregamento) || 0 });
          }
          (t.abastecimentos || []).forEach((a) => {
            if (Number(a.valor) > 0) {
              expenses.push({ data: a.data || t.data, tipo: "Abastecimento", descricao: a.posto || "Abastecimento", planoDeConta: "Combustível", valor: Number(a.valor) || 0 });
            }
          });
          (t.gastosExtras || []).forEach((g) => {
            if (Number(g.valor) > 0) {
              expenses.push({ data: g.data || t.data, tipo: "Gasto extra", descricao: g.descricao || "Gasto extra", planoDeConta: "Despesas (Saídas)", valor: Number(g.valor) || 0 });
            }
          });
          expenses.sort((a, b) => (a.data || "").localeCompare(b.data || ""));
          const totalDespesas = expenses.reduce((s, e) => s + e.valor, 0);
          return {
            id: t.id,
            data: t.data,
            codigo: t.contrato || `V${idx + 1}`,
            empresa: t.empresa || "—",
            origem: t.origem || "—",
            destino: t.destino || "—",
            valorViagem: valorTotal(t),
            expenses,
            totalDespesas,
          };
        });
        const despesasVeiculoTruck = despesasInMonth
          .filter((d) => d.caminhaoId === tr.id)
          .sort((a, b) => (a.data || "").localeCompare(b.data || ""));
        const despesasVeiculoTotal = despesasVeiculoTruck.reduce((s, d) => s + (Number(d.valor) || 0), 0);
        // esse total precisa descontar TUDO — receita menos comissão/abastecimento/gastos
        // de cada viagem, e menos as despesas do veículo — pra bater com o líquido do resumido
        const totalDespesasViagens = tripRows.reduce((s, t) => s + t.totalDespesas, 0);
        const totalVeiculo = tripRows.reduce((s, t) => s + t.valorViagem, 0) - totalDespesasViagens - despesasVeiculoTotal;
        return { id: tr.id, placa: tr.placa, tripRows, despesasVeiculoTruck, despesasVeiculoTotal, totalVeiculo };
      })
      .filter((g) => g.tripRows.length > 0 || g.despesasVeiculoTruck.length > 0);
    return groups;
  }, [trips, trucksCavalos, reportMonth, filterTruck, despesasVeiculo]);

  const normalizarNome = (nome) => (nome || "").trim().replace(/\s+/g, " ").toLowerCase();

  // lista de postos já usados (abastecimento e gasto extra), pra sugerir
  // autocomplete e evitar cadastrar o mesmo posto com grafias diferentes
  // gastos extras (pedágio pago na hora, comida, conserto de estrada etc)
  // agrupados por caminhão, num período — pra visualizar separado dos
  // boletos, já que esses nunca geram financeiro/boleto de verdade
  const relatorioGastosExtras = useMemo(() => {
    const tripsNoPeriodo = trips.filter((t) => (t.data || "") >= gastosPeriodStart && (t.data || "") <= gastosPeriodEnd);
    const porCaminhao = {};
    const porSetor = {};
    const registrarGasto = (chaveCaminhao, placa, gasto) => {
      if (!porCaminhao[chaveCaminhao]) porCaminhao[chaveCaminhao] = { caminhaoId: gasto.caminhaoIdReal, placa, gastos: [], total: 0 };
      porCaminhao[chaveCaminhao].gastos.push(gasto);
      porCaminhao[chaveCaminhao].total += Number(gasto.valor) || 0;
      const setorNome = (gasto.setor || "").trim();
      if (setorNome) {
        if (!porSetor[setorNome]) porSetor[setorNome] = { setor: setorNome, total: 0, quantidade: 0 };
        porSetor[setorNome].total += Number(gasto.valor) || 0;
        porSetor[setorNome].quantidade += 1;
      }
    };
    tripsNoPeriodo.forEach((t) => {
      (t.gastosExtras || []).forEach((g) => {
        if (!(Number(g.valor) > 0)) return;
        registrarGasto(t.caminhaoId || "sem-placa", truckLabel(t.caminhaoId), { ...g, data: g.data || t.data, trip: t, caminhaoIdReal: t.caminhaoId });
      });
    });
    // taxa de viagem (rateio entre caminhões, pago pra quem arruma a viagem)
    // já vira despesa do veículo quando você clica em "dividir entre os
    // caminhões" — entra aqui também, junto com os gastos da própria viagem,
    // pra ficar tudo num só relatório
    despesasVeiculo
      .filter((d) => (d.data || "") >= gastosPeriodStart && (d.data || "") <= gastosPeriodEnd && (d.descricao || "").startsWith("Taxa de viagem"))
      .forEach((d) => {
        if (!(Number(d.valor) > 0)) return;
        registrarGasto(d.caminhaoId || "sem-placa", truckLabel(d.caminhaoId), { id: d.id, data: d.data, descricao: d.descricao, categoria: "Taxa de Viagem", setor: "", valor: d.valor, caminhaoIdReal: d.caminhaoId });
      });
    // se tiver um setor escolhido no filtro, só mostra os gastos daquele
    // setor (o total por caminhão também passa a refletir só esse recorte)
    let rows = Object.values(porCaminhao);
    if (gastosSetorFiltro !== "all") {
      rows = rows
        .map((r) => {
          const gastosFiltrados = r.gastos.filter((g) => (g.setor || "").trim() === gastosSetorFiltro);
          return { ...r, gastos: gastosFiltrados, total: gastosFiltrados.reduce((s, g) => s + (Number(g.valor) || 0), 0) };
        })
        .filter((r) => r.gastos.length > 0);
    }
    rows = rows.map((r) => ({ ...r, gastos: r.gastos.sort((a, b) => (a.data || "").localeCompare(b.data || "")) }));
    rows.sort((a, b) => b.total - a.total);
    const totalGeral = rows.reduce((s, r) => s + r.total, 0);
    const setoresList = Object.values(porSetor).sort((a, b) => b.total - a.total);
    return { rows, totalGeral, setoresList };
  }, [trips, despesasVeiculo, gastosPeriodStart, gastosPeriodEnd, gastosSetorFiltro]);

  const postosList = useMemo(() => {
    const set = new Set();
    trips.forEach((t) => {
      (t.abastecimentos || []).forEach((a) => { if (a.posto && a.posto.trim()) set.add(a.posto.trim()); });
      (t.gastosExtras || []).forEach((g) => { if (g.posto && g.posto.trim()) set.add(g.posto.trim()); });
    });
    return Array.from(set).sort();
  }, [trips]);

  // categorias de gasto extra já usadas antes, mais algumas sugestões padrão —
  // só pra dar sugestão no autocomplete, não é uma lista fechada
  const categoriasGastoList = useMemo(() => {
    const set = new Set(["Despesas Estrada", "Alimentação", "Multa", "Manutenção"]);
    trips.forEach((t) => {
      (t.gastosExtras || []).forEach((g) => { if (g.categoria && g.categoria.trim()) set.add(g.categoria.trim()); });
    });
    return Array.from(set).sort();
  }, [trips]);

  // setor é opcional — só preenche quando a pessoa quer separar um tipo
  // específico de gasto (tipo "Borracharia Miradouro", "Lavador") pra
  // acompanhar o total dele à parte, sem mexer na categoria geral
  const setoresGastoList = useMemo(() => {
    const set = new Set(["Borracharia", "Lavador"]);
    trips.forEach((t) => {
      (t.gastosExtras || []).forEach((g) => { if (g.setor && g.setor.trim()) set.add(g.setor.trim()); });
    });
    return Array.from(set).sort();
  }, [trips]);

  // unificar postos é manual (não automático como motoristas), porque a mesma
  // grafia às vezes muda de palavras de verdade (ex: "Portal Itapuã" vs "Portal
  // de Itapuã"), não só maiúscula/acento — e detectar isso sozinho arriscaria
  // juntar dois postos diferentes por engano
  const [unificarPostosOpen, setUnificarPostosOpen] = useState(false);
  const [postosSelecionados, setPostosSelecionados] = useState([]);
  const [postoCanonico, setPostoCanonico] = useState("");

  const abrirUnificarPostos = () => {
    setPostosSelecionados([]);
    setPostoCanonico("");
    setUnificarPostosOpen(true);
  };

  const togglePostoSelecionado = (nome) => {
    setPostosSelecionados((prev) => {
      const proximo = prev.includes(nome) ? prev.filter((n) => n !== nome) : [...prev, nome];
      return proximo;
    });
    setPostoCanonico((atual) => (atual ? atual : nome));
  };

  const confirmUnificarPostos = () => {
    if (postosSelecionados.length < 2) {
      alert("Selecione pelo menos dois postos que sejam o mesmo lugar.");
      return;
    }
    const canonico = postoCanonico.trim();
    if (!canonico) {
      alert("Digite (ou escolha) o nome que vai ficar valendo pra esse posto.");
      return;
    }
    if (!window.confirm(`Unificar ${postosSelecionados.length} grafias em "${canonico}"?\n\n${postosSelecionados.join(" / ")}\n\nIsso corrige só o nome do posto nos lançamentos já feitos — valores e datas não mudam.`)) return;

    const set = new Set(postosSelecionados);
    const nextTrips = trips.map((t) => {
      let mudou = false;
      const abastecimentos = (t.abastecimentos || []).map((a) => {
        if (a.posto && set.has(a.posto.trim())) { mudou = true; return { ...a, posto: canonico }; }
        return a;
      });
      const gastosExtras = (t.gastosExtras || []).map((g) => {
        if (g.posto && set.has(g.posto.trim())) { mudou = true; return { ...g, posto: canonico }; }
        return g;
      });
      return mudou ? { ...t, abastecimentos, gastosExtras } : t;
    });
    setTrips(nextTrips);
    persist(trucks, nextTrips);
    setUnificarPostosOpen(false);
    setPostosSelecionados([]);
    setPostoCanonico("");
    alert("Postos unificados!");
  };

  const motoristasList = useMemo(() => {
    const porChave = {};
    const registrar = (nomeOriginal) => {
      const nome = (nomeOriginal || "").trim();
      if (!nome) return;
      const chave = normalizarNome(nome);
      if (!porChave[chave]) porChave[chave] = nome;
    };
    motoristas.forEach((m) => registrar(m.nome));
    trips.forEach((t) => registrar(t.motorista));
    vales.forEach((v) => registrar(v.motorista));
    // prioriza a grafia cadastrada em Motoristas quando existir
    motoristas.forEach((m) => {
      const chave = normalizarNome(m.nome);
      if (chave) porChave[chave] = m.nome;
    });
    return Object.values(porChave).sort();
  }, [motoristas, trips, vales]);

  const motoristasDuplicados = useMemo(() => {
    const grupos = {};
    const contagem = {};
    const registrar = (nomeOriginal) => {
      const nome = (nomeOriginal || "").trim();
      if (!nome) return;
      const chave = normalizarNome(nome);
      if (!grupos[chave]) grupos[chave] = new Set();
      grupos[chave].add(nome);
      contagem[nome] = (contagem[nome] || 0) + 1;
    };
    motoristas.forEach((m) => registrar(m.nome));
    trips.forEach((t) => registrar(t.motorista));
    vales.forEach((v) => registrar(v.motorista));
    fechamentos.forEach((f) => registrar(f.motorista));

    const resultado = [];
    Object.entries(grupos).forEach(([chave, variantesSet]) => {
      const variantes = Array.from(variantesSet);
      if (variantes.length > 1) {
        // escolhe a grafia canonica: prioriza a que ja esta cadastrada em Motoristas, senao a mais usada
        const cadastrada = motoristas.find((m) => normalizarNome(m.nome) === chave);
        const canonico = cadastrada
          ? cadastrada.nome
          : variantes.slice().sort((a, b) => (contagem[b] || 0) - (contagem[a] || 0))[0];
        resultado.push({ chave, variantes, canonico });
      }
    });
    return resultado;
  }, [motoristas, trips, vales, fechamentos]);

  const unificarMotoristas = () => {
    if (motoristasDuplicados.length === 0) {
      alert("Não encontrei nomes duplicados pra unificar.");
      return;
    }
    const resumo = motoristasDuplicados
      .map((g) => `• ${g.variantes.join(" / ")}  →  ${g.canonico}`)
      .join("\n");
    if (!window.confirm(`Vou unificar estes nomes (mantendo a grafia à direita):\n\n${resumo}\n\nIsso corrige só o texto do nome nos lançamentos já feitos — valores e datas não mudam. Continuar?`)) return;

    const mapa = {};
    motoristasDuplicados.forEach((g) => {
      g.variantes.forEach((v) => { mapa[v] = g.canonico; });
    });
    const aplicar = (nome) => (nome && mapa[nome.trim()]) ? mapa[nome.trim()] : nome;

    const nextTrips = trips.map((t) => (t.motorista && mapa[t.motorista.trim()] ? { ...t, motorista: aplicar(t.motorista) } : t));
    const nextVales = vales.map((v) => (v.motorista && mapa[v.motorista.trim()] ? { ...v, motorista: aplicar(v.motorista) } : v));
    const nextFechamentos = fechamentos.map((f) => (f.motorista && mapa[f.motorista.trim()] ? { ...f, motorista: aplicar(f.motorista) } : f));

    // deduplica o cadastro de motoristas tambem, mantendo so a grafia canonica
    const nomesCanonicosUsados = new Set();
    const nextMotoristas = [];
    motoristas.forEach((m) => {
      const canonico = aplicar(m.nome);
      const chaveCanonico = normalizarNome(canonico);
      if (!nomesCanonicosUsados.has(chaveCanonico)) {
        nomesCanonicosUsados.add(chaveCanonico);
        nextMotoristas.push({ ...m, nome: canonico });
      }
    });
    // garante que toda grafia canonica usada nos lancamentos tambem esteja cadastrada
    motoristasDuplicados.forEach((g) => {
      const chaveCanonico = normalizarNome(g.canonico);
      if (!nomesCanonicosUsados.has(chaveCanonico)) {
        nomesCanonicosUsados.add(chaveCanonico);
        nextMotoristas.push({ id: uid(), nome: g.canonico });
      }
    });

    setTrips(nextTrips);
    setVales(nextVales);
    setFechamentos(nextFechamentos);
    setMotoristas(nextMotoristas);
    persist(trucks, nextTrips, nextVales, boletos, empresas, nextFechamentos, despesasVeiculo, taxasPool, nextMotoristas);
    alert("Pronto! Nomes unificados.");
  };

  const contasBancariasList = useMemo(() => {
    const set = new Set([
      ...CONTAS_COMUNS,
      ...contas.map((c) => c.nome),
      ...boletos.map((b) => b.contaBancaria).filter(Boolean),
    ]);
    return Array.from(set).sort();
  }, [contas, boletos]);

  const boletosEmpresas = useMemo(() => {
    const set = new Set([
      ...empresas.map((e) => e.nome),
      ...boletos.map((b) => b.empresa).filter(Boolean),
    ]);
    return Array.from(set).sort();
  }, [boletos, empresas]);

  // por padrão, todas as empresas entram no relatório de boletos a pagar, exceto
  // as que estiverem marcadas como "não aparecer" (ex: empresa que a gente só
  // controla, mas o pagamento é feito direto com eles, sem passar pela transportadora)
  const boletosEmpresasPadrao = useMemo(() => {
    return boletosEmpresas.filter((nome) => {
      const cadastro = empresas.find((e) => e.nome === nome);
      return !cadastro || cadastro.incluirRelatorio !== false;
    });
  }, [boletosEmpresas, empresas]);

  const [boletosEmpresasOverride, setBoletosEmpresasOverride] = useState(null);
  const boletosEmpresasSelecionadas = boletosEmpresasOverride !== null ? boletosEmpresasOverride : boletosEmpresasPadrao;

  const toggleEmpresaSelecionada = (nome) => {
    const atual = boletosEmpresasSelecionadas;
    const proximo = atual.includes(nome) ? atual.filter((n) => n !== nome) : [...atual, nome];
    setBoletosEmpresasOverride(proximo);
  };
  const marcarTodasEmpresas = () => setBoletosEmpresasOverride([...boletosEmpresas]);
  const desmarcarTodasEmpresas = () => setBoletosEmpresasOverride([]);
  const resetEmpresasParaPadrao = () => setBoletosEmpresasOverride(null);

  const kmAtualPorCaminhao = useMemo(() => {
    const mapa = {};
    trips.forEach((t) => {
      let maiorKm = Math.max(Number(t.kmInicio) || 0, Number(t.kmFim) || 0);
      // o km lançado nos abastecimentos também conta — às vezes é o valor mais
      // recente e mais alto, mais atualizado do que o km início/fim da viagem
      (t.abastecimentos || []).forEach((a) => {
        const kmAbastec = Number(a.km) || 0;
        if (kmAbastec > maiorKm) maiorKm = kmAbastec;
      });
      if (maiorKm > 0 && (!mapa[t.caminhaoId] || maiorKm > mapa[t.caminhaoId])) {
        mapa[t.caminhaoId] = maiorKm;
      }
    });
    return mapa;
  }, [trips]);

  const ultimaTrocaPorCaminhao = useMemo(() => {
    const mapa = {};
    trocasOleo.forEach((t) => {
      const km = Number(t.km) || 0;
      if (!mapa[t.caminhaoId] || km > mapa[t.caminhaoId].km) {
        mapa[t.caminhaoId] = { km, data: t.data };
      }
    });
    return mapa;
  }, [trocasOleo]);

  const alertasTrocaOleo = useMemo(() => {
    return trucks
      .filter((tr) => !tr.semAlertaOleo)
      .map((tr) => {
        const kmAtual = kmAtualPorCaminhao[tr.id] || 0;
        const ultima = ultimaTrocaPorCaminhao[tr.id];
        const kmDesdeTroca = ultima ? kmAtual - ultima.km : kmAtual;
        return { caminhaoId: tr.id, placa: tr.placa, kmAtual, ultima, kmDesdeTroca, intervalo: intervaloOleoDoCaminhao(tr) };
      })
      .filter((a) => a.kmAtual > 0 && a.kmDesdeTroca >= a.intervalo)
      .sort((a, b) => b.kmDesdeTroca - a.kmDesdeTroca);
  }, [trucks, kmAtualPorCaminhao, ultimaTrocaPorCaminhao]);

  // viagens com motorista definido mas sem valor de comissão lançado ainda (nem
  // base, nem fixo) — pra avisar antes de fechar/pagar um motorista e faltar algo
  const viagensSemComissaoPreenchida = useMemo(() => {
    return trips.filter((t) => {
      if (!t.motorista || !t.motorista.trim()) return false;
      return t.comissaoFixa ? !(Number(t.valorComissaoFixa) > 0) : !(Number(t.valorComissaoBase) > 0);
    });
  }, [trips]);

  // viagens sem nem adiantamento nem saldo lançado ainda — geralmente porque o
  // contrato/valor do frete ainda não chegou. Elas somem de "a receber" sem
  // esse aviso, então fica fácil esquecer de voltar e preencher depois
  const viagensSemValorFrete = useMemo(() => {
    return trips.filter((t) => !(Number(t.adiantamento) > 0) && !(Number(t.saldoReceber) > 0));
  }, [trips]);

  // caminhões com documento/licenciamento vencido ou vencendo em até 30 dias
  // caminhões sem o documento (CRLV) do ano atual anexado ainda
  const caminhoesDocumentoAtrasado = useMemo(() => {
    const anoAtual = new Date().getFullYear();
    return trucks
      .filter((tr) => !(tr.documentosPorAno && tr.documentosPorAno[anoAtual]))
      .map((tr) => ({ id: tr.id, placa: tr.placa, tipo: tr.tipo }));
  }, [trucks]);

  const cavalosIpvaNaoPago = useMemo(() => {
    const anoAtual = new Date().getFullYear();
    return trucks
      .filter((tr) => tr.tipo !== "carreta" && !(tr.ipvaPagoPorAno && tr.ipvaPagoPorAno[anoAtual]))
      .map((tr) => ({ id: tr.id, placa: tr.placa, tipo: tr.tipo }));
  }, [trucks]);

  const carretasLicenciamentoNaoPago = useMemo(() => {
    const anoAtual = new Date().getFullYear();
    return trucks
      .filter((tr) => tr.tipo === "carreta" && !(tr.ipvaPagoPorAno && tr.ipvaPagoPorAno[anoAtual]))
      .map((tr) => ({ id: tr.id, placa: tr.placa, tipo: tr.tipo }));
  }, [trucks]);

  // boletos vencidos (sem baixa) das empresas que a pessoa quer acompanhar —
  // por padrão todas, exceto as que ela excluir (ex: uma empresa que ela
  // paga direto, sem passar pelo sistema de boletos)
  const boletosVencidosAlerta = useMemo(() => {
    const hoje = todayISO();
    return boletos.filter((b) => {
      if (boletoEstaQuitado(b)) return false;
      if (empresasExcluidasAlertaVencido.includes(b.empresa)) return false;
      const vencimento = b.novoVencimento || b.dataVencimento;
      return vencimento && vencimento < hoje;
    });
  }, [boletos, empresasExcluidasAlertaVencido]);

  const totalOutrosAlertas = viagensSemComissaoPreenchida.length + viagensSemValorFrete.length + caminhoesDocumentoAtrasado.length + cavalosIpvaNaoPago.length + carretasLicenciamentoNaoPago.length + boletosVencidosAlerta.length;

  const abastecimentosFlat = useMemo(() => {
    const flat = [];
    trips.forEach((t) => {
      (t.abastecimentos || []).forEach((a) => {
        if (Number(a.valor) > 0 || a.litragem) {
          flat.push({
            id: a.id,
            tripId: t.id,
            caminhaoId: t.caminhaoId,
            data: a.data || t.data,
            litragem: a.litragem,
            km: a.km,
            valor: Number(a.valor) || 0,
            posto: a.posto && a.posto.trim() ? a.posto.trim() : "Sem posto definido",
            numeroCupom: a.numeroCupom || "",
            tipo: a.tipo === "arla" ? "arla" : "diesel",
            origem: a.tipo === "arla" ? "Arla" : "Diesel",
          });
        }
      });
      // gastos extras com posto preenchido (ex: lubrificação no mesmo cupom do abastecimento)
      (t.gastosExtras || []).forEach((g) => {
        if (g.posto && g.posto.trim() && Number(g.valor) > 0) {
          flat.push({
            id: g.id,
            tripId: t.id,
            caminhaoId: t.caminhaoId,
            data: g.data || t.data,
            litragem: "",
            km: "",
            valor: Number(g.valor) || 0,
            posto: g.posto.trim(),
            numeroCupom: g.numeroCupom || "",
            tipo: "outro",
            origem: g.descricao || "Gasto extra",
          });
        }
      });
    });
    return flat;
  }, [trips]);

  const abastecPostosList = useMemo(() => {
    const set = new Set(abastecimentosFlat.map((a) => a.posto));
    precosPostos.forEach((p) => set.add(p.posto));
    return Array.from(set).sort();
  }, [abastecimentosFlat, precosPostos]);

// calcula consumo (km/L) entre abastecimentos de diesel de UM caminhão, já
// ordenados por data (ordem do abastecimento, não da lançamento). Quando um
// abastecimento não tem km lançado (motorista às vezes não passa), ele não
// vira um "ponto" de cálculo — mas a litragem dele continua sendo somada e
// entra no próximo abastecimento que tiver km, pra não sumir litro nenhum
// da conta
function calcularConsumoEntreAbastecimentos(itensDieselOrdenados) {
  let ultimoComKm = null;
  let litrosAcumulados = 0;
  let postosPulados = [];
  const pontos = [];
  itensDieselOrdenados.forEach((a) => {
    const km = Number(a.km) || 0;
    const litros = Number(a.litragem) || 0;
    litrosAcumulados += litros;
    if (km > 0) {
      if (ultimoComKm) {
        const kmRodado = km - ultimoComKm.km;
        const consumo = litrosAcumulados > 0 && kmRodado > 0 ? kmRodado / litrosAcumulados : null;
        pontos.push({ ...a, kmRodado, litros: litrosAcumulados, consumo, postosPulados: [...postosPulados], kmAnterior: ultimoComKm.km, postoAnterior: ultimoComKm.posto, tripIdAnterior: ultimoComKm.tripId });
      } else {
        pontos.push({ ...a, consumo: null, litros: litrosAcumulados, postosPulados: [...postosPulados] });
      }
      ultimoComKm = { km, data: a.data, posto: a.posto, tripId: a.tripId };
      litrosAcumulados = 0;
      postosPulados = [];
    } else if (a.posto) {
      postosPulados.push({ posto: a.posto, tripId: a.tripId, id: a.id });
    }
  });
  return pontos;
}

  // perfil de abastecimento de uma placa específica: histórico ordenado pela
  // DATA do abastecimento (nunca pela ordem em que foi lançado no sistema —
  // motorista às vezes manda depois, com data retroativa), consumo (km/l)
  // calculado entre abastecimentos consecutivos de diesel nessa ordem, média
  // dos últimos 6, último abastecimento e gasto do mês atual
  const perfilAbastecimentoCaminhao = useMemo(() => {
    if (abastecPlacaFilter === "all") return null;
    const itensDiesel = abastecimentosFlat
      .filter((a) => a.caminhaoId === abastecPlacaFilter && a.tipo === "diesel")
      .sort((a, b) => (a.data || "").localeCompare(b.data || "") || (Number(a.km) || 0) - (Number(b.km) || 0));
    const comConsumo = calcularConsumoEntreAbastecimentos(itensDiesel);
    const ultimosSeis = comConsumo.filter((x) => x.consumo != null).slice(-6);
    const consumoMedio = ultimosSeis.length > 0 ? ultimosSeis.reduce((s, x) => s + x.consumo, 0) / ultimosSeis.length : null;

    const todosDaPlaca = abastecimentosFlat.filter((a) => a.caminhaoId === abastecPlacaFilter).sort((a, b) => (b.data || "").localeCompare(a.data || ""));
    const ultimoAbastecimento = todosDaPlaca.length > 0 ? todosDaPlaca[0].data : null;

    const mesAtual = new Date().toISOString().slice(0, 7);
    const gastoNoMes = abastecimentosFlat
      .filter((a) => a.caminhaoId === abastecPlacaFilter && (a.data || "").slice(0, 7) === mesAtual)
      .reduce((s, a) => s + a.valor, 0);

    return {
      historico: [...comConsumo].reverse(),
      consumoMedio,
      ultimoAbastecimento,
      gastoNoMes,
      chartPoints: ultimosSeis,
    };
  }, [abastecimentosFlat, abastecPlacaFilter]);

  // Relatório de Consumo (km/L): pra cada caminhão, ordena os abastecimentos
  // de diesel pela DATA do abastecimento (não pela ordem em que foram
  // lançados — um motorista pode mandar o comprovante dias depois, com data
  // retroativa) e calcula km rodado ÷ litros abastecidos entre um posto e o
  // seguinte. Fica registrado aqui pra sempre poder consultar depois.
  const relatorioConsumo = useMemo(() => {
    let todasAsLinhas = [];
    trucksCavalos.forEach((tr) => {
      const itens = abastecimentosFlat
        .filter((a) => a.caminhaoId === tr.id && a.tipo === "diesel")
        .sort((a, b) => (a.data || "").localeCompare(b.data || "") || (Number(a.km) || 0) - (Number(b.km) || 0));
      calcularConsumoEntreAbastecimentos(itens).forEach((p) => {
        if (p.consumo == null && p.kmRodado === undefined) return; // primeiro ponto da placa, sem par anterior
        todasAsLinhas.push({
          id: p.id,
          placa: tr.placa,
          caminhaoId: tr.id,
          data: p.data,
          posto: p.posto,
          tripId: p.tripId,
          postoAnterior: p.postoAnterior || "",
          tripIdAnterior: p.tripIdAnterior || null,
          postosPulados: p.postosPulados || [],
          kmAnterior: p.kmAnterior || 0,
          kmAtual: Number(p.km) || 0,
          kmRodado: p.kmRodado,
          litros: p.litros,
          consumo: p.consumo,
          invalido: p.kmRodado <= 0,
        });
      });
    });

    let linhas = todasAsLinhas.filter((l) => l.data >= consumoPeriodStart && l.data <= consumoPeriodEnd);
    if (consumoCaminhaoFiltro !== "all") linhas = linhas.filter((l) => l.caminhaoId === consumoCaminhaoFiltro);
    linhas.sort((a, b) => (a.data || "").localeCompare(b.data || ""));

    const porPlaca = {};
    linhas.forEach((l) => {
      if (!porPlaca[l.placa]) porPlaca[l.placa] = [];
      porPlaca[l.placa].push(l);
    });
    const gruposPorPlaca = Object.entries(porPlaca)
      .map(([placa, itens]) => {
        const validos = itens.filter((i) => i.consumo != null);
        const mediaGeral = validos.length > 0 ? validos.reduce((s, i) => s + i.consumo, 0) / validos.length : null;
        return { placa, itens, mediaGeral, litrosTotais: itens.reduce((s, i) => s + i.litros, 0), kmTotais: itens.reduce((s, i) => s + Math.max(i.kmRodado, 0), 0) };
      })
      .sort((a, b) => a.placa.localeCompare(b.placa));

    return { linhas, gruposPorPlaca };
  }, [abastecimentosFlat, trucksCavalos, consumoPeriodStart, consumoPeriodEnd, consumoCaminhaoFiltro]);

  const abastecReport = useMemo(() => {
    const filtered = abastecimentosFlat
      .filter((a) => a.data >= abastecPeriodStart && a.data <= abastecPeriodEnd)
      .filter((a) => abastecPostoFilter === "all" || a.posto === abastecPostoFilter)
      .filter((a) => abastecPlacaFilter === "all" || a.caminhaoId === abastecPlacaFilter)
      .sort((a, b) => (a.posto || "").localeCompare(b.posto || "") || (a.data || "").localeCompare(b.data || ""));

    const porPostoMap = {};
    filtered.forEach((a) => {
      if (!porPostoMap[a.posto]) porPostoMap[a.posto] = { posto: a.posto, items: [], valor: 0, litragemDiesel: 0, litragemArla: 0 };
      porPostoMap[a.posto].items.push(a);
      porPostoMap[a.posto].valor += a.valor;
      if (a.tipo === "arla") porPostoMap[a.posto].litragemArla += Number(a.litragem) || 0;
      else if (a.tipo === "diesel") porPostoMap[a.posto].litragemDiesel += Number(a.litragem) || 0;
    });
    const porPosto = Object.values(porPostoMap).sort((a, b) => b.valor - a.valor);

    const totals = filtered.reduce(
      (acc, a) => ({
        valor: acc.valor + a.valor,
        litragemDiesel: acc.litragemDiesel + (a.tipo === "diesel" ? Number(a.litragem) || 0 : 0),
        litragemArla: acc.litragemArla + (a.tipo === "arla" ? Number(a.litragem) || 0 : 0),
      }),
      { valor: 0, litragemDiesel: 0, litragemArla: 0 }
    );
    return { items: filtered, porPosto, totals };
  }, [abastecimentosFlat, abastecPeriodStart, abastecPeriodEnd, abastecPostoFilter, abastecPlacaFilter]);

  const exportAbastecCSV = () => {
    const header = ["Posto", "Data", "Caminhão", "Origem", "Litragem", "R$/L", "Cupom", "Valor"];
    const lines = [header.join(";")];
    abastecReport.items.forEach((a) => {
      const valorLitro = Number(a.litragem) > 0 ? (a.valor / Number(a.litragem)).toFixed(3) : "";
      lines.push([a.posto, fmtDate(a.data), truckLabel(a.caminhaoId), a.origem, a.litragem || "", valorLitro, a.numeroCupom || "", a.valor.toFixed(2)].join(";"));
    });
    lines.push(["TOTAL", "", "", "", `${formatLitros(abastecReport.totals.litragemDiesel)} (diesel)`, "", `${formatLitros(abastecReport.totals.litragemArla)} (arla)`, abastecReport.totals.valor.toFixed(2)].join(";"));
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a2 = document.createElement("a");
    a2.href = url;
    a2.download = `abastecimentos-${abastecPeriodStart}-a-${abastecPeriodEnd}.csv`;
    a2.click();
    URL.revokeObjectURL(url);
  };

  const setAbastecQuickPeriod = (kind) => {
    const d = new Date();
    if (kind === "hoje") {
      const iso = d.toISOString().slice(0, 10);
      setAbastecPeriodStart(iso);
      setAbastecPeriodEnd(iso);
    } else if (kind === "semana") {
      const day = d.getDay();
      const start = new Date(d); start.setDate(d.getDate() - day);
      const end = new Date(d); end.setDate(d.getDate() + (6 - day));
      setAbastecPeriodStart(start.toISOString().slice(0, 10));
      setAbastecPeriodEnd(end.toISOString().slice(0, 10));
    } else if (kind === "mes") {
      setAbastecPeriodStart(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10));
      setAbastecPeriodEnd(new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10));
    } else if (kind === "tudo") {
      setAbastecPeriodStart("2000-01-01");
      setAbastecPeriodEnd("2099-12-31");
    }
  };

  const vencimentoEfetivo = (b) => b.novoVencimento || b.dataVencimento;

  // lista unificada: boletos em aberto (pendente/vencido) entram pelo
  // vencimento; boletos pagos entram pelos "eventos de pagamento" — cada
  // baixa e cada quitação final na sua própria data. Assim "Pago" sempre
  // representa o dinheiro que realmente saiu no período, do mesmo jeito em
  // toda a tela de Boletos, no relatório em PDF, no CSV e no Dashboard Geral
  const boletosReport = useMemo(() => {
    const hoje = todayISO();
    const empresasOk = (b) => boletosEmpresasSelecionadas.includes(b.empresa);

    const abertos = boletos
      .filter(empresasOk)
      .filter((b) => !boletoEstaQuitado(b))
      .filter((b) => vencimentoEfetivo(b) >= boletosPeriodStart && vencimentoEfetivo(b) <= boletosPeriodEnd)
      .map((b) => ({
        ...b,
        __kind: "aberto",
        __status: statusBoleto(b, hoje),
        __valorItem: saldoRestanteBoleto(b),
        __dataItem: vencimentoEfetivo(b),
        __key: b.id,
      }));

    const eventosPagos = [];
    boletos.filter(empresasOk).forEach((b) => {
      eventosPagamentoBoleto(b).forEach((ev, i) => {
        if (ev.data >= boletosPeriodStart && ev.data <= boletosPeriodEnd) {
          eventosPagos.push({
            ...b,
            __kind: "pago",
            __status: "pago",
            __valorItem: ev.valor,
            __dataItem: ev.data,
            __ehBaixaParcial: ev.tipo === "baixa",
            __contaEvento: ev.contaBancaria,
            __key: `${b.id}-${ev.data}-${i}`,
          });
        }
      });
    });

    let combinados;
    if (boletosReportStatus === "pago") combinados = eventosPagos;
    else if (boletosReportStatus === "aberto") combinados = abertos;
    else if (boletosReportStatus === "pendente" || boletosReportStatus === "vencido") combinados = abertos.filter((b) => b.__status === boletosReportStatus);
    else combinados = [...abertos, ...eventosPagos];

    combinados.sort((a, b) => (a.__dataItem || "").localeCompare(b.__dataItem || ""));

    const totals = { pendente: 0, vencido: 0, pago: 0, total: 0 };
    abertos.forEach((b) => { totals[b.__status] += b.__valorItem; });
    eventosPagos.forEach((ev) => { totals.pago += ev.__valorItem; });
    totals.total = totals.pendente + totals.vencido + totals.pago;

    return { items: combinados, totals };
  }, [boletos, boletosPeriodStart, boletosPeriodEnd, boletosEmpresasSelecionadas, boletosReportStatus]);

  const exportBoletosCSV = () => {
    const header = ["Empresa", "Descricao", "Nota Fiscal", "Valor", "Data (vencimento ou pagamento)", "Conta Bancaria", "Status", "Observacao"];
    const lines = [header.join(";")];
    boletosReport.items.forEach((b) => {
      const status = b.__kind === "pago" ? (b.__ehBaixaParcial ? "Pago (baixa parcial)" : "Pago") : b.__status === "vencido" ? "Vencido" : "Pendente";
      lines.push(
        [b.empresa, b.descricao || "", b.notaFiscal, b.__valorItem.toFixed(2), fmtDate(b.__dataItem), b.__kind === "pago" ? (b.__contaEvento || b.contaBancaria) : b.contaBancaria, status, b.observacao || ""]
          .join(";")
      );
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `boletos-${boletosPeriodStart}-a-${boletosPeriodEnd}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportReportCSV = () => {
    const header = ["Placa", "Viagens", "Receita", "Comissao", "Abastecimento", "Gastos Extras", "Despesas Veiculo", "Liquido"];
    const lines = [header.join(";")];
    monthlyReport.rows.forEach((r) => {
      lines.push(
        [r.placa, r.viagens, r.receita.toFixed(2), r.comissaoTotal.toFixed(2), r.abastecimentoTotal.toFixed(2), r.gastosTotal.toFixed(2), r.despesasVeiculoTotal.toFixed(2), r.liquido.toFixed(2)]
          .join(";")
      );
    });
    lines.push(
      ["TOTAL", monthlyReport.totals.viagens, monthlyReport.totals.receita.toFixed(2), monthlyReport.totals.comissaoTotal.toFixed(2), monthlyReport.totals.abastecimentoTotal.toFixed(2), monthlyReport.totals.gastosTotal.toFixed(2), monthlyReport.totals.despesasVeiculoTotal.toFixed(2), monthlyReport.totals.liquido.toFixed(2)]
        .join(";")
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-liquido-${reportMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportBackup = () => {
    const data = JSON.stringify({ trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas, trocasOleo, servicosVeiculo, semParar, seguro, semPararOutros }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-controle-viagens-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!window.confirm("Importar este backup vai SUBSTITUIR todos os dados atuais. Continuar?")) return;
        const nextTrucks = parsed.trucks || [];
        const nextTrips = (parsed.trips || []).map(normalizeTrip);
        const nextVales = parsed.vales || [];
        const nextBoletos = parsed.boletos || [];
        const nextEmpresas = parsed.empresas || [];
        const nextFechamentos = parsed.fechamentos || [];
        const nextDespesasVeiculo = parsed.despesasVeiculo || [];
        const nextTaxasPool = parsed.taxasPool || [];
        const nextMotoristas = parsed.motoristas || [];
        const nextContas = parsed.contas || [];
        const nextTrocasOleo = parsed.trocasOleo || [];
        const nextServicosVeiculo = parsed.servicosVeiculo || [];
        const nextSemParar = parsed.semParar || [];
        const nextSeguro = parsed.seguro || [];
        const nextSemPararOutros = parsed.semPararOutros || [];
        setTrucks(nextTrucks);
        setTrips(nextTrips);
        setVales(nextVales);
        setBoletos(nextBoletos);
        setEmpresas(nextEmpresas);
        setFechamentos(nextFechamentos);
        setDespesasVeiculo(nextDespesasVeiculo);
        setTaxasPool(nextTaxasPool);
        setMotoristas(nextMotoristas);
        setContas(nextContas);
        setTrocasOleo(nextTrocasOleo);
        setServicosVeiculo(nextServicosVeiculo);
        setSemParar(nextSemParar);
        setSeguro(nextSeguro);
        setSemPararOutros(nextSemPararOutros);
        persist(nextTrucks, nextTrips, nextVales, nextBoletos, nextEmpresas, nextFechamentos, nextDespesasVeiculo, nextTaxasPool, nextMotoristas, nextContas, nextTrocasOleo, nextServicosVeiculo, nextSemParar, nextSeguro, nextSemPararOutros);
      } catch (err) {
        alert("Não consegui ler esse arquivo. Confira se é um backup válido exportado por este app.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  if (!signedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#EEF0F2",
          fontFamily: "'Inter', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "36px 30px",
            maxWidth: 380,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(27,36,48,0.1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <img src={LOGO_BASE64} alt="L.L. Campos Transportes" style={{ height: 60 }} />
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 26, color: "#1B2430", marginBottom: 6 }}>
            CONTROLE DE VIAGENS
          </div>
          <div style={{ color: "#5A6472", fontSize: 14, marginBottom: 24 }}>
            Conecte sua conta Google pra acessar a planilha compartilhada.
          </div>
          <button
            onClick={connectGoogle}
            disabled={!gsiReady || connecting}
            style={{
              background: gsiReady ? "#D9A419" : "#D7DBE0",
              color: "#1B2430",
              border: "none",
              borderRadius: 10,
              padding: "12px 20px",
              fontWeight: 700,
              fontSize: 15,
              cursor: gsiReady ? "pointer" : "default",
              width: "100%",
            }}
          >
            {connecting ? "Conectando..." : gsiReady ? "Conectar com Google" : "Carregando..."}
          </button>
          {authError && (
            <div style={{ marginTop: 16, color: "#B0402E", fontSize: 13, background: "#FBEBE8", borderRadius: 10, padding: "10px 12px" }}>
              {authError}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div style={{ padding: 40, fontFamily: "'Inter', sans-serif", color: "#5A6472" }}>
        Carregando dados da planilha...
      </div>
    );
  }

  if (senhaAppSalva && !senhaAppDesbloqueada) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#EEF0F2",
          fontFamily: "'Inter', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "36px 30px",
            maxWidth: 360,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(27,36,48,0.1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <img src={LOGO_BASE64} alt="L.L. Campos Transportes" style={{ height: 60 }} />
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 18, color: "#1B2430", marginBottom: 16 }}>
            🔒 Digite a senha do sistema
          </div>
          <input
            type="password"
            autoFocus
            value={senhaAppDigitada}
            onChange={(e) => { setSenhaAppDigitada(e.target.value); setErroSenhaApp(""); }}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              if (senhaAppDigitada === senhaAppSalva) { setSenhaAppDesbloqueada(true); setSenhaAppDigitada(""); }
              else setErroSenhaApp("Senha incorreta.");
            }}
            style={{ ...inputStyle, width: "100%", textAlign: "center", fontSize: 16, marginBottom: 12, boxSizing: "border-box" }}
          />
          {erroSenhaApp && (
            <div style={{ color: "#B0402E", fontSize: 13, marginBottom: 12 }}>{erroSenhaApp}</div>
          )}
          <button
            onClick={() => {
              if (senhaAppDigitada === senhaAppSalva) { setSenhaAppDesbloqueada(true); setSenhaAppDigitada(""); }
              else setErroSenhaApp("Senha incorreta.");
            }}
            style={{ background: "#2451A6", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontWeight: 700, fontSize: 15, cursor: "pointer", width: "100%" }}
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div
      className="no-print app-shell"
      style={{
        minHeight: "100vh",
        background: "#EEF0F2",
        fontFamily: "'Inter', sans-serif",
        color: "#1B2430",
        display: "flex",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          /* sem isso, o navegador ignora as cores de fundo na hora de imprimir/gerar PDF,
             pra "economizar tinta" — aqui a gente força ele a manter as cores dos relatórios */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
        }
        input:focus, select:focus, textarea:focus { border-color: #D9A419 !important; box-shadow: 0 0 0 3px rgba(217,164,25,0.15); }

        /* linhas clicáveis de lista (ver lista de a receber/recebido/comissão,
           viagens, boletos etc) ganham um destaque leve ao passar o mouse (ou
           tocar no iPad), pra ficar claro que é clicável e ajudar a acompanhar
           qual linha está selecionada */
        .linha-clicavel { transition: filter 0.12s, background 0.12s; }
        .linha-clicavel:hover, .linha-clicavel:active { filter: brightness(0.96); }

        /* ajustes gerais pra tela de celular (até 640px de largura) — nada
           de função muda aqui, é só deixar mais legível numa tela estreita */
        @media (max-width: 640px) {
          /* formulário de editar viagem: as duas colunas (viagem/financeiro
             e abastecimento/gastos) viram uma só empilhada, e o resumo fixo
             deixa de "grudar" no topo (senão atrapalha rolando no celular) */
          .grid-duas-colunas-viagem { grid-template-columns: 1fr !important; }

          /* tabelas viram roláveis pro lado, em vez de espremer as colunas
             até ficar ilegível — funciona pra toda tabela do app de uma vez.
             Importante: a <table> em si mantém o layout normal de tabela
             (senão as colunas desalinham entre uma linha e outra); quem rola
             de lado é o quadrado que envolve a tabela */
          table { white-space: nowrap !important; }
          div:has(> table) { overflow-x: auto !important; }

          /* a coluna lateral de "Filtrar por empresa" em Boletos passa a
             ficar em cima da lista, em vez de do lado (não cabe lado a lado
             numa tela estreita) */
          .sidebar-empresas { width: 100% !important; position: static !important; }
          .boletos-flex-row { flex-direction: column !important; }

          /* cabeçalho: título e botões menores, ocupando a largura toda */
          .header-titulo { font-size: 22px !important; }
          .header-botoes button, .header-botoes label { padding: 7px 10px !important; font-size: 12px !important; }

          /* modais e dropdowns não avançam mais largo que a tela */
          .painel-modal { width: 92vw !important; max-width: 92vw !important; left: 0 !important; }

          /* barra de navegação vertical vira uma faixa horizontal em cima,
             já que não cabe do lado numa tela estreita */
          /* no celular, a barra lateral empilha ACIMA do conteúdo (em vez de do
             lado, que empurrava a tela toda pra fora), e vira uma faixa
             horizontal roláveis com os ícones em fileira única */
          .app-shell { flex-direction: column !important; }
          .nav-lateral {
            width: 100% !important; min-height: auto !important; height: auto !important; max-height: none !important;
            flex-direction: row !important; flex-wrap: nowrap !important; overflow-x: auto !important;
            overflow-y: hidden !important; position: static !important; padding: 8px !important;
          }
          .nav-lateral .nav-logo-area { display: none !important; }
          .nav-lateral .nav-group { flex-direction: row !important; flex-shrink: 0; }
          .nav-lateral .nav-divider { display: none !important; }
          .nav-lateral .nav-item { flex-direction: column !important; white-space: nowrap; padding: 8px 10px !important; font-size: 10px !important; flex-shrink: 0; }

          /* os menuzinhos que abrem (Dashboard: Viagens/Geral, e Relatórios)
             ficavam cortados/escondidos no celular porque o pai (.nav-lateral)
             tem overflow-x:auto pra rolar os ícones — isso corta qualquer
             coisa "position:absolute" que passe da borda. position:fixed
             escapa desse corte, então o menu aparece fixo colado embaixo da
             faixa de navegação, ocupando a largura da tela */
          .nav-lateral .nav-dropdown {
            position: fixed !important; top: 60px !important; left: 8px !important; right: 8px !important;
            width: auto !important; max-width: none !important; max-height: 70vh !important; overflow-y: auto !important;
          }

          /* modais de relatório (Relatório de boletos, Recebimento, Gastos
             extras, Consumo km/L etc.): menos respiro nas bordas, e a
             fileira de filtros (período/caminhão/setor/botões) empilha em
             vez de ficar toda espremida numa linha só, que era o que
             deixava tudo "tumultuado" numa tela estreita */
          .modal-relatorio { padding: 14px !important; width: 96vw !important; max-width: 96vw !important; }
          .modal-relatorio .filtros-relatorio { flex-direction: column !important; align-items: stretch !important; }
          .modal-relatorio .filtros-relatorio > * { width: 100% !important; }
          .modal-relatorio .filtros-relatorio input, .modal-relatorio .filtros-relatorio select { width: 100% !important; }
          .modal-relatorio .filtros-relatorio button { width: 100% !important; }

          /* calendário de período (usado em Gastos extras e Consumo):
             abria "flutuando" por cima do conteúdo com posição calculada a
             partir do botão — numa tela estreita isso ficava cortado ou
             sobrepondo texto. Passa a abrir fixo, colado no topo da tela */
          .modal-relatorio .periodo-dropdown-painel {
            position: fixed !important; top: 70px !important; left: 8px !important; right: 8px !important;
            width: auto !important; max-width: none !important; max-height: 70vh !important; overflow-y: auto !important;
          }
        }
      `}</style>

      {/* barra de navegação vertical */}
      <div
        className="nav-lateral"
        style={{
          width: 220, flexShrink: 0, height: "100vh", maxHeight: "100vh", overflowY: "auto",
          position: "sticky", top: 0, alignSelf: "flex-start",
          background: "#1B2430", display: "flex", flexDirection: "column", padding: "20px 14px",
        }}
      >
        <div className="nav-logo-area" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, padding: "0 6px" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "8px 12px", display: "flex", alignItems: "center" }}>
            <img src={LOGO_BASE64} alt="L.L. Campos Transportes" style={{ height: 32, display: "block" }} />
          </div>
        </div>

        <div className="nav-group" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ position: "relative" }}>
            <button
              className="nav-item"
              onClick={() => setDashboardMenuAberto((v) => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 10, textAlign: "left", width: "100%",
                padding: "10px 12px", borderRadius: 12, border: "none",
                background: (view === "dashboard" || view === "dashboardGeral") ? "#2563EB" : "transparent",
                color: (view === "dashboard" || view === "dashboardGeral") ? "#fff" : "#9AA5B1",
                fontWeight: (view === "dashboard" || view === "dashboardGeral") ? 700 : 500, fontSize: 14, cursor: "pointer",
              }}
            >
              <span>📊</span> Dashboard
            </button>
            {dashboardMenuAberto && (
              <div
                className="painel-modal nav-dropdown"
                style={{ position: "absolute", left: 0, right: 0, top: "100%", marginTop: 6, zIndex: 40, background: "#fff", border: "1px solid #E4E7EB", borderRadius: 12, boxShadow: "0 12px 32px rgba(27,36,48,0.14)", padding: 8 }}
              >
                {[
                  { id: "dashboard", icone: "🚚", rotulo: "Viagens" },
                  { id: "dashboardGeral", icone: "🌐", rotulo: "Geral" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setView(item.id); setDashboardMenuAberto(false); }}
                    className="linha-clicavel"
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "9px 10px", borderRadius: 8, border: "none", background: "transparent", color: "#1B2430", fontWeight: 500, fontSize: 13, cursor: "pointer" }}
                  >
                    <span style={{ display: "inline-flex", justifyContent: "center", width: 20, flexShrink: 0 }}>{item.icone}</span>
                    <span>{item.rotulo}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {[
            { id: "viagens", icone: "🚚", rotulo: "Viagens" },
            { id: "boletos", icone: "🧾", rotulo: "Boletos" },
            { id: "abastecimentos", icone: "⛽", rotulo: "Abastecimentos" },
            { id: "trocaoleo", icone: "🛢️", rotulo: "Troca de Óleo" },
            { id: "semparar", icone: "🛣️", rotulo: "Sem Parar" },
            { id: "seguro", icone: "🛡️", rotulo: "Seguro" },
          ].map((item) => (
            <button
              key={item.id}
              className="nav-item"
              onClick={() => setView(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, textAlign: "left",
                padding: "10px 12px", borderRadius: 12, border: "none",
                background: view === item.id ? "#2563EB" : "transparent",
                color: view === item.id ? "#fff" : "#9AA5B1",
                fontWeight: view === item.id ? 700 : 500, fontSize: 14, cursor: "pointer",
              }}
            >
              <span>{item.icone}</span>
              {item.rotulo}
            </button>
          ))}
        </div>

        <div className="nav-divider" style={{ height: 1, background: "#2E3742", margin: "16px 6px" }} />

        <div className="nav-group" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div className="nav-item" style={{ padding: "6px 12px", fontSize: 11, color: "#6B7684", textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5 }}>
            Relatórios
          </div>
          <div style={{ position: "relative" }}>
            <button
              className="nav-item"
              onClick={() => setRelatoriosMenuAberto((v) => !v)}
              style={{ display: "flex", alignItems: "center", gap: 10, textAlign: "left", padding: "10px 12px", borderRadius: 12, border: "none", background: "transparent", color: "#9AA5B1", fontWeight: 500, fontSize: 13, cursor: "pointer", width: "100%" }}
            >
              <span>📊</span> Relatórios
            </button>
            {relatoriosMenuAberto && (
              <div
                className="painel-modal nav-dropdown"
                style={{ position: "absolute", left: 0, right: 0, top: "100%", marginTop: 6, zIndex: 40, background: "#fff", border: "1px solid #E4E7EB", borderRadius: 12, boxShadow: "0 12px 32px rgba(27,36,48,0.14)", padding: 8, width: "auto" }}
              >
                {[
                  { icone: "📊", rotulo: "Relatório mensal", onClick: () => setReportOpen(true) },
                  { icone: "💰", rotulo: "Recebimento", onClick: () => setRelatorioRecebimentoOpen(true) },
                  { icone: "🧾", rotulo: "Gastos extras", onClick: () => setRelatorioGastosOpen(true) },
                  { icone: "⛽", rotulo: "Consumo (km/L)", onClick: () => setRelatorioConsumoOpen(true) },
                  { icone: "🔧", rotulo: "Serviços por empresa", onClick: () => setRelatorioServicosOpen(true) },
                ].map((item) => (
                  <button
                    key={item.rotulo}
                    onClick={() => { item.onClick(); setRelatoriosMenuAberto(false); }}
                    className="linha-clicavel"
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "9px 10px", borderRadius: 8, border: "none", background: "transparent", color: "#1B2430", fontWeight: 500, fontSize: 13, cursor: "pointer" }}
                  >
                    <span style={{ display: "inline-flex", justifyContent: "center", width: 20, flexShrink: 0 }}>{item.icone}</span>
                    <span>{item.rotulo}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            className="nav-item"
            onClick={abrirConfiguracoes}
            style={{ display: "flex", alignItems: "center", gap: 10, textAlign: "left", padding: "10px 12px", borderRadius: 12, border: "none", background: "transparent", color: "#9AA5B1", fontWeight: 500, fontSize: 13, cursor: "pointer" }}
          >
            <span>⚙️</span> Configurações
          </button>
        </div>

        <div className="nav-divider" style={{ height: 1, background: "#2E3742", margin: "16px 6px" }} />

        <div className="nav-group" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <button
            className="nav-item"
            onClick={tentarSalvarPendencias}
            title="Forçar salvar agora tudo que ainda não foi confirmado"
            style={{ display: "flex", alignItems: "center", gap: 10, textAlign: "left", padding: "10px 12px", borderRadius: 12, border: "none", background: "transparent", color: "#9AA5B1", fontWeight: 500, fontSize: 13, cursor: "pointer" }}
          >
            <span>💾</span> Salvar
          </button>
          <button
            className="nav-item"
            onClick={reloadFromSheets}
            title="Buscar as atualizações mais recentes da planilha"
            style={{ display: "flex", alignItems: "center", gap: 10, textAlign: "left", padding: "10px 12px", borderRadius: 12, border: "none", background: "transparent", color: "#9AA5B1", fontWeight: 500, fontSize: 13, cursor: "pointer" }}
          >
            <span>🔄</span> Atualizar
          </button>
          <button
            className="nav-item"
            onClick={exportBackup}
            title="Baixar uma cópia de segurança dos dados"
            style={{ display: "flex", alignItems: "center", gap: 10, textAlign: "left", padding: "10px 12px", borderRadius: 12, border: "none", background: "transparent", color: "#9AA5B1", fontWeight: 500, fontSize: 13, cursor: "pointer" }}
          >
            <span>⬇️</span> Baixar backup
          </button>
          <label
            className="nav-item"
            title="Restaurar dados de um arquivo de backup"
            style={{ display: "flex", alignItems: "center", gap: 10, textAlign: "left", padding: "10px 12px", borderRadius: 12, border: "none", background: "transparent", color: "#9AA5B1", fontWeight: 500, fontSize: 13, cursor: "pointer" }}
          >
            <span>⬆️</span> Importar backup
            <input type="file" accept="application/json" onChange={importBackup} style={{ display: "none" }} />
          </label>
        </div>

        <div className="nav-divider" style={{ height: 1, background: "#2E3742", margin: "16px 6px" }} />

        <button
          className="nav-item"
          onClick={sair}
          title="Desconectar da conta Google"
          style={{ display: "flex", alignItems: "center", gap: 10, textAlign: "left", padding: "10px 12px", borderRadius: 12, border: "none", background: "transparent", color: "#E88C7D", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
        >
          <span>🚪</span> Sair
        </button>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>

      {/* header */}
      <div style={{ background: "#fff", padding: "18px 28px", position: "sticky", top: 0, zIndex: 10, borderBottom: "1px solid #E4E7EB", boxShadow: "0 1px 3px rgba(27,36,48,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={LOGO_BASE64} alt="L.L. Campos Transportes" style={{ height: 44, display: "block" }} />
            <div>
            <div
              className="header-titulo"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: 26,
                color: "#1B2430",
                letterSpacing: 0.3,
                lineHeight: 1,
              }}
            >
              CONTROLE DE VIAGENS
              <span style={{ fontSize: 11, color: "#9AA5B1", fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums", marginLeft: 10, verticalAlign: "middle" }}>
                v{APP_VERSION}
              </span>
            </div>
            <div style={{ color: "#5A6472", fontSize: 13, marginTop: 4 }}>
              {trucksCavalos.length} {trucksCavalos.length === 1 ? "caminhão" : "caminhões"} na frota
              {saveState === "saving" && "  ·  salvando..."}
              {saveState === "saved" && "  ·  salvo"}
              {saveState === "error" && "  ·  erro ao salvar, tente de novo"}
              {saveState === "readonly" && "  ·  🔒 acesso somente leitura"}
            </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setAlertaOleoAberto((v) => !v)}
              style={{
                background: alertasTrocaOleo.length > 0 ? "#FBEBE8" : "#F7F8FA",
                border: `1px solid ${alertasTrocaOleo.length > 0 ? "#B0402E" : "#E4E7EB"}`,
                borderRadius: 12, padding: "8px 14px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700,
                color: alertasTrocaOleo.length > 0 ? "#7A2A1D" : "#9AA5B1",
              }}
            >
              🛢️ {alertasTrocaOleo.length > 0 ? `${alertasTrocaOleo.length} p/ trocar óleo` : "Óleo em dia"}
            </button>
            {alertaOleoAberto && (
              <div
                className="painel-modal"
                style={{
                  position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 30,
                  background: "#fff", border: "1px solid #E4E7EB", borderRadius: 12,
                  boxShadow: "0 12px 32px rgba(27,36,48,0.14)", padding: 14, width: 340,
                  maxWidth: "90vw", maxHeight: "70vh", overflowY: "auto",
                }}
              >
                {alertasTrocaOleo.length === 0 ? (
                  <div style={{ fontSize: 13, color: "#9AA5B1", textAlign: "center", padding: "16px 0" }}>
                    Nenhum caminhão precisando trocar óleo. 🎉
                  </div>
                ) : (
                  <div style={{ background: "#FBEBE8", borderRadius: 10, padding: 10, fontSize: 12, color: "#7A2A1D" }}>
                    ⚠️ 🛢️ <strong>{alertasTrocaOleo.length === 1 ? "1 caminhão precisa" : `${alertasTrocaOleo.length} caminhões precisam`} trocar o óleo:</strong>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                      {alertasTrocaOleo.map((a) => (
                        <button
                          key={a.caminhaoId}
                          onClick={() => { setAlertaOleoAberto(false); setView("trocaoleo"); }}
                          className="linha-clicavel"
                          style={{ background: "#fff", border: "1px solid #B0402E33", borderRadius: 20, padding: "4px 10px", fontSize: 12, color: "#7A2A1D", cursor: "pointer" }}
                        >
                          {a.placa} ({a.kmDesdeTroca.toLocaleString("pt-BR")} km rodados)
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setAlertasAbertos((v) => !v)}
              style={{
                background: totalOutrosAlertas > 0 ? "#FFF6E2" : "#F7F8FA",
                border: `1px solid ${totalOutrosAlertas > 0 ? "#D9A419" : "#E4E7EB"}`,
                borderRadius: 12, padding: "8px 14px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700,
                color: totalOutrosAlertas > 0 ? "#8A5A00" : "#9AA5B1",
              }}
            >
              🔔 {totalOutrosAlertas > 0 ? `${totalOutrosAlertas} ${totalOutrosAlertas === 1 ? "alerta" : "alertas"}` : "Sem alertas"}
            </button>
            {alertasAbertos && (
              <div
                className="painel-modal"
                style={{
                  position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 30,
                  background: "#fff", border: "1px solid #E4E7EB", borderRadius: 12,
                  boxShadow: "0 12px 32px rgba(27,36,48,0.14)", padding: 14, width: 380,
                  maxWidth: "90vw", maxHeight: "70vh", overflowY: "auto",
                }}
              >
                {totalOutrosAlertas === 0 ? (
                  <div style={{ fontSize: 13, color: "#9AA5B1", textAlign: "center", padding: "16px 0" }}>
                    Nenhum alerta no momento. 🎉
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {viagensSemComissaoPreenchida.length > 0 && (
                      <div style={{ background: "#FFF6E2", borderRadius: 10, padding: 10, fontSize: 12, color: "#8A5A00" }}>
                        ⚠️ <strong>{viagensSemComissaoPreenchida.length === 1 ? "1 viagem está" : `${viagensSemComissaoPreenchida.length} viagens estão`} sem valor de comissão lançado:</strong>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                          {viagensSemComissaoPreenchida.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => { setAlertasAbertos(false); openEditTrip(t); }}
                              className="linha-clicavel"
                              style={{ background: "#fff", border: "1px solid #D9A41933", borderRadius: 20, padding: "4px 10px", fontSize: 12, color: "#8A5A00", cursor: "pointer" }}
                            >
                              {truckLabel(t.caminhaoId)} {fmtDate(t.data)} ({t.motorista})
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {viagensSemValorFrete.length > 0 && (
                      <div style={{ background: "#FBEBE8", borderRadius: 10, padding: 10, fontSize: 12, color: "#7A2A1D" }}>
                        ⚠️ <strong>{viagensSemValorFrete.length === 1 ? "1 viagem está" : `${viagensSemValorFrete.length} viagens estão`} sem valor de frete lançado (contrato ainda não chegou?):</strong>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                          {viagensSemValorFrete.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => { setAlertasAbertos(false); openEditTrip(t); }}
                              className="linha-clicavel"
                              style={{ background: "#fff", border: "1px solid #B0402E33", borderRadius: 20, padding: "4px 10px", fontSize: 12, color: "#7A2A1D", cursor: "pointer" }}
                            >
                              {truckLabel(t.caminhaoId)} {fmtDate(t.data)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {caminhoesDocumentoAtrasado.length > 0 && (
                      <div style={{ background: "#FBEBE8", borderRadius: 10, padding: 10, fontSize: 12, color: "#7A2A1D" }}>
                        ⚠️ 📄 <strong>{caminhoesDocumentoAtrasado.length === 1 ? "1 caminhão está" : `${caminhoesDocumentoAtrasado.length} caminhões estão`} sem o documento de {new Date().getFullYear()} anexado:</strong>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                          {caminhoesDocumentoAtrasado.map((x) => (
                            <button
                              key={x.id}
                              onClick={() => {
                                setAlertasAbertos(false);
                                setConfigSecaoAberta(x.tipo === "carreta" ? "carretas" : "caminhoes");
                                setCaminhaoExpandidoId(x.id);
                                setConfigOpen(true);
                              }}
                              className="linha-clicavel"
                              style={{ background: "#fff", border: "1px solid #B0402E33", borderRadius: 20, padding: "4px 10px", fontSize: 12, color: "#7A2A1D", cursor: "pointer" }}
                            >
                              {x.placa}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {cavalosIpvaNaoPago.length > 0 && (
                      <div style={{ background: "#FFF6E2", borderRadius: 10, padding: 10, fontSize: 12, color: "#8A5A00" }}>
                        ⚠️ 💰 <strong>{cavalosIpvaNaoPago.length === 1 ? "1 caminhão está" : `${cavalosIpvaNaoPago.length} caminhões estão`} com IPVA de {new Date().getFullYear()} não marcado como pago:</strong>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                          {cavalosIpvaNaoPago.map((x) => (
                            <button
                              key={x.id}
                              onClick={() => {
                                setAlertasAbertos(false);
                                setConfigSecaoAberta("caminhoes");
                                setCaminhaoExpandidoId(x.id);
                                setConfigOpen(true);
                              }}
                              className="linha-clicavel"
                              style={{ background: "#fff", border: "1px solid #D9A41933", borderRadius: 20, padding: "4px 10px", fontSize: 12, color: "#8A5A00", cursor: "pointer" }}
                            >
                              {x.placa}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {carretasLicenciamentoNaoPago.length > 0 && (
                      <div style={{ background: "#FFF6E2", borderRadius: 10, padding: 10, fontSize: 12, color: "#8A5A00" }}>
                        ⚠️ 💰 <strong>{carretasLicenciamentoNaoPago.length === 1 ? "1 carreta está" : `${carretasLicenciamentoNaoPago.length} carretas estão`} com taxa de licenciamento de {new Date().getFullYear()} não marcada como paga:</strong>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                          {carretasLicenciamentoNaoPago.map((x) => (
                            <button
                              key={x.id}
                              onClick={() => {
                                setAlertasAbertos(false);
                                setConfigSecaoAberta("carretas");
                                setCaminhaoExpandidoId(x.id);
                                setConfigOpen(true);
                              }}
                              className="linha-clicavel"
                              style={{ background: "#fff", border: "1px solid #D9A41933", borderRadius: 20, padding: "4px 10px", fontSize: 12, color: "#8A5A00", cursor: "pointer" }}
                            >
                              {x.placa}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {boletosVencidosAlerta.length > 0 && (
                      <div style={{ background: "#FBEBE8", borderRadius: 10, padding: 10, fontSize: 12, color: "#7A2A1D" }}>
                        ⚠️ 🧾 <strong>{boletosVencidosAlerta.length === 1 ? "1 boleto está" : `${boletosVencidosAlerta.length} boletos estão`} vencidos sem baixa:</strong>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                          {boletosVencidosAlerta.map((b) => (
                            <button
                              key={b.id}
                              onClick={() => { setAlertasAbertos(false); setView("boletos"); setBoletoParaAbrirId(b.id); }}
                              className="linha-clicavel"
                              style={{ background: "#fff", border: "1px solid #B0402E33", borderRadius: 20, padding: "4px 10px", fontSize: 12, color: "#7A2A1D", cursor: "pointer" }}
                            >
                              {b.empresa} · {fmtDate(b.novoVencimento || b.dataVencimento)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          </div>
        </div>
      </div>

      {saveState === "readonly" && (
        <div style={{ background: "#FFF6E2", borderBottom: "1px solid #D9A419", padding: "10px 28px", fontSize: 13, color: "#8A5A00" }}>
          🔒 <strong>Sua conta está com acesso somente leitura nesta planilha.</strong> Você pode ver tudo normalmente, mas as alterações não estão sendo salvas. Se precisar mudar algo, peça pra quem tem permissão de edição fazer por você.
        </div>
      )}

      {saveState === "error" && (
        <div style={{ background: "#FBEBE8", borderBottom: "1px solid #B0402E", padding: "10px 28px", fontSize: 13, color: "#7A2A1D", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span>
            ⚠️ <strong>Não consegui salvar a última alteração.</strong> Pode ser a internet ou a sessão do Google — o que você lançou continua na tela, mas ainda não está garantido na planilha.
          </span>
          <span style={{ display: "flex", gap: 8 }}>
            <button
              onClick={tentarSalvarPendencias}
              style={{ background: "#B0402E", color: "#fff", border: "none", borderRadius: 10, padding: "7px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              Tentar salvar de novo
            </button>
            <button
              onClick={connectGoogle}
              title="Abre a tela de login do Google de novo, rapidinho — costuma resolver quando o 'tentar salvar de novo' não funciona"
              style={{ background: "none", color: "#7A2A1D", border: "1px solid #B0402E", borderRadius: 10, padding: "7px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              Reconectar
            </button>
          </span>
        </div>
      )}

      {view === "dashboard" && (
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "24px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>Dashboard</div>
              <div style={{ fontSize: 13, color: "#5A6472" }}>Visão geral da frota — viagens, abastecimento e rendimento por caminhão</div>
            </div>
            <Field label="Período">
              <PeriodoDropdown
                periodStart={dashboardPeriodStart}
                periodEnd={dashboardPeriodEnd}
                onQuickPeriod={setDashboardQuickPeriod}
                onChangeStart={setDashboardPeriodStart}
                onChangeEnd={setDashboardPeriodEnd}
              />
            </Field>
          </div>

          {filterTruck !== "all" && (
            <div style={{ background: "#FFF6E2", border: "1px solid #D9A419", borderRadius: 10, padding: "8px 14px", fontSize: 12, color: "#8A5A00", marginBottom: 16 }}>
              Mostrando só {truckLabel(filterTruck)}.{" "}
              <button onClick={() => setFilterTruck("all")} style={{ background: "none", border: "none", color: "#2451A6", textDecoration: "underline", cursor: "pointer", fontSize: 12, padding: 0 }}>
                ver todos os caminhões
              </button>
            </div>
          )}

          {/* totais da frota no mês */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <div style={{ flex: "1 1 0", minWidth: 160 }}><MileSign label="Viagens" value={dashboardReport.totals.viagens} tone="blue" icon="🚚" full /></div>
            <div style={{ flex: "1 1 0", minWidth: 160 }}><MileSign label="Receita bruta" value={BRL(dashboardReport.totals.receita)} tone="green" icon="💵" full /></div>
            <div style={{ flex: "1 1 0", minWidth: 160 }}><MileSign label="Abastecimento" value={BRL(dashboardReport.totals.abastecimentoTotal)} tone="amber" icon="⛽" full /></div>
            <div style={{ flex: "1 1 0", minWidth: 160 }}>
              <MileSign
                label="Rendimento líquido"
                value={BRL(dashboardReport.totals.liquido)}
                tone={dashboardReport.totals.liquido >= 0 ? "green" : "red"}
                icon={dashboardReport.totals.liquido >= 0 ? "📈" : "📉"}
                full
              />
            </div>
          </div>

          {(() => {
            const rowsComViagem = dashboardReport.rows.filter((r) => r.viagens > 0);
            if (rowsComViagem.length === 0) return null;
            const maiorFaturamento = rowsComViagem.reduce((melhor, r) => (r.liquido > melhor.liquido ? r : melhor), rowsComViagem[0]);
            const menorAbastecimento = rowsComViagem.reduce((melhor, r) => (r.abastecimentoTotal < melhor.abastecimentoTotal ? r : melhor), rowsComViagem[0]);
            const trFaturamento = trucksCavalos.find((tr) => tr.id === maiorFaturamento.id);
            const trAbastecimento = trucksCavalos.find((tr) => tr.id === menorAbastecimento.id);
            return (
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
                <div style={{ flex: "1 1 340px", minWidth: 300, display: "flex", alignItems: "center", gap: 16, background: "linear-gradient(160deg, #fff 0%, #E9F5F1 100%)", border: "1px solid #EDEFF2", borderRadius: 14, boxShadow: "0 2px 8px rgba(27,36,48,0.06)", padding: 16 }}>
                  <div style={{ width: 96, height: 96, borderRadius: 12, overflow: "hidden", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {trFaturamento && trFaturamento.foto ? (
                      <img src={trFaturamento.foto} alt={maiorFaturamento.placa} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <TruckIcon size={64} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontStyle: "italic", fontWeight: 600, color: "#12503F", textTransform: "uppercase", marginBottom: 4 }}>
                      🏆 Maior rendimento no mês
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>{maiorFaturamento.placa}</div>
                    <div style={{ fontSize: 12, color: "#9AA5B1", marginBottom: 4 }}>{trFaturamento && trFaturamento.modelo ? trFaturamento.modelo : "Modelo não cadastrado"}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#12503F", fontVariantNumeric: "tabular-nums" }}>{BRL(maiorFaturamento.liquido)}</div>
                  </div>
                </div>
                <div style={{ flex: "1 1 340px", minWidth: 300, display: "flex", alignItems: "center", gap: 16, background: "linear-gradient(160deg, #fff 0%, #EEF2FA 100%)", border: "1px solid #EDEFF2", borderRadius: 14, boxShadow: "0 2px 8px rgba(27,36,48,0.06)", padding: 16 }}>
                  <div style={{ width: 96, height: 96, borderRadius: 12, overflow: "hidden", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {trAbastecimento && trAbastecimento.foto ? (
                      <img src={trAbastecimento.foto} alt={menorAbastecimento.placa} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <TruckIcon size={64} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontStyle: "italic", fontWeight: 600, color: "#2451A6", textTransform: "uppercase", marginBottom: 4 }}>
                      ⛽ Menor gasto de abastecimento
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>{menorAbastecimento.placa}</div>
                    <div style={{ fontSize: 12, color: "#9AA5B1", marginBottom: 4 }}>{trAbastecimento && trAbastecimento.modelo ? trAbastecimento.modelo : "Modelo não cadastrado"}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#2451A6", fontVariantNumeric: "tabular-nums" }}>{BRL(menorAbastecimento.abastecimentoTotal)}</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* card por caminhao */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {dashboardReport.rows.map((r) => {
              const trCompleto = trucksCavalos.find((tr) => tr.id === r.id);
              const rendimentoPositivo = r.liquido >= 0;
              return (
                <div
                  key={r.id}
                  onClick={() => { setFilterTruck(r.id); setReportMonth(dashboardPeriodEnd.slice(0, 7)); setReportView("detalhado"); setReportOpen(true); }}
                  className="linha-clicavel"
                  style={{
                    background: "#fff", border: "1px solid #E4E7EB", borderRadius: 14,
                    boxShadow: "0 2px 8px rgba(27,36,48,0.06)", padding: 18, cursor: "pointer",
                    flex: "1 1 280px", minWidth: 260,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", background: "#F7F8F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {trCompleto && trCompleto.foto ? (
                        <img src={trCompleto.foto} alt={r.placa} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <TruckIcon size={30} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{r.placa}{r.carretaVinculada && <span style={{ color: "#9AA5B1", fontWeight: 400 }}> / {r.carretaVinculada}</span>}</div>
                      <div style={{ fontSize: 12, color: "#9AA5B1" }}>{trCompleto && trCompleto.modelo ? trCompleto.modelo : "Modelo não cadastrado"}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#5A6472", marginBottom: 6 }}>
                    <span>🚚 Viagens</span>
                    <strong style={{ color: "#1B2430" }}>{r.viagens}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#5A6472", marginBottom: 6 }}>
                    <span>⛽ Abastecimento</span>
                    <strong style={{ color: "#1B2430" }}>{BRL(r.abastecimentoTotal)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#5A6472", marginBottom: 10 }}>
                    <span>💰 Receita</span>
                    <strong style={{ color: "#1B2430" }}>{BRL(r.receita)}</strong>
                  </div>
                  <div
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      background: rendimentoPositivo ? "#E9F5F1" : "#FBEBE8", borderRadius: 10, padding: "8px 12px",
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: rendimentoPositivo ? "#12503F" : "#7A2A1D" }}>
                      {rendimentoPositivo ? "📈" : "📉"} Rendimento
                    </span>
                    <strong style={{ color: rendimentoPositivo ? "#12503F" : "#7A2A1D" }}>{BRL(r.liquido)}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          {comissaoGeradaPorMotorista.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>💰 Comissão gerada por motorista no período</div>
              <div style={{ fontSize: 12, color: "#9AA5B1", marginBottom: 12 }}>
                Só pra visualização — o valor total que cada motorista gerou nesse período, independente de já ter sido pago, fechado ou descontado em vale. Não mexe em nada da tela de Comissão.
              </div>
              <div style={{ background: "#fff", border: "1px solid #E4E7EB", borderRadius: 14, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F7F8F9" }}>
                      <th style={{ textAlign: "left", padding: "10px 14px", color: "#5A6472", fontWeight: 700 }}>Motorista</th>
                      <th style={{ textAlign: "right", padding: "10px 14px", color: "#5A6472", fontWeight: 700 }}>Viagens</th>
                      <th style={{ textAlign: "right", padding: "10px 14px", color: "#5A6472", fontWeight: 700 }}>Comissão gerada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comissaoGeradaPorMotorista.map((m, i) => (
                      <tr key={m.motorista} style={{ background: i % 2 === 0 ? "#fff" : "#F7F8F9" }}>
                        <td style={{ padding: "10px 14px", borderTop: "1px solid #EEF0F2", fontWeight: 600 }}>{m.motorista}</td>
                        <td style={{ padding: "10px 14px", borderTop: "1px solid #EEF0F2", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{m.viagens}</td>
                        <td style={{ padding: "10px 14px", borderTop: "1px solid #EEF0F2", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#12503F" }}>{BRL(m.comissaoGerada)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#1B2430" }}>
                      <td style={{ padding: "10px 14px", color: "#fff", fontWeight: 700 }}>TOTAL</td>
                      <td style={{ padding: "10px 14px", color: "#fff", fontWeight: 700, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                        {comissaoGeradaPorMotorista.reduce((s, m) => s + m.viagens, 0)}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#fff", fontWeight: 700, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                        {BRL(comissaoGeradaPorMotorista.reduce((s, m) => s + m.comissaoGerada, 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {view === "dashboardGeral" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 28px" }}>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>Dashboard Geral</div>
          <div style={{ fontSize: 13, color: "#5A6472", marginBottom: 16 }}>
            Receita bruta − comissões − gastos extras (despesas estrada) − boletos das categorias escolhidas − taxa de viagem = rendimento líquido geral
          </div>

          <Field label="Período">
            <PeriodoDropdown
              periodStart={dashboardGeralPeriodStart}
              periodEnd={dashboardGeralPeriodEnd}
              onQuickPeriod={setDashboardGeralQuickPeriod}
              onChangeStart={setDashboardGeralPeriodStart}
              onChangeEnd={setDashboardGeralPeriodEnd}
            />
          </Field>

          {categoriasIncluidasDashboardGeral.length === 0 && (
            <div style={{ background: "#FFF6E2", border: "1px solid #D9A419", borderRadius: 12, padding: 14, marginTop: 16, fontSize: 13, color: "#8A5A00" }}>
              ⚠️ Nenhuma categoria de boleto foi escolhida ainda pra entrar nesse cálculo — os boletos não estão sendo descontados. Vai em <strong>Configurações → Geral → 🌐 Categorias de boleto no Dashboard Geral</strong> e marca as que você quer (juros, financiamentos, despesas de caminhão, seguros...).
            </div>
          )}

          {(() => {
            const totalDespesas = dashboardGeralReport.comissoes + dashboardGeralReport.gastosExtrasEstrada + dashboardGeralReport.boletosDespesa + dashboardGeralReport.taxaViagem;
            return (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20, marginBottom: 8 }}>
                <div style={{ flex: "1 1 0", minWidth: 160 }}>
                  <MileSign label="Receita bruta" value={BRL(dashboardGeralReport.receitaBruta)} tone="green" icon="💵" full />
                </div>
                <div style={{ flex: "1 1 0", minWidth: 160 }}>
                  <MileSign label="Total de despesas" value={BRL(totalDespesas)} tone="amber" icon="🧾" full />
                </div>
                <div style={{ flex: "1 1 0", minWidth: 160 }}>
                  <MileSign
                    label="Rendimento líquido geral"
                    value={BRL(dashboardGeralReport.rendimentoLiquidoGeral)}
                    tone={dashboardGeralReport.rendimentoLiquidoGeral >= 0 ? "green" : "red"}
                    icon={dashboardGeralReport.rendimentoLiquidoGeral >= 0 ? "📈" : "📉"}
                    full
                  />
                </div>
              </div>
            );
          })()}

          <div style={{ fontSize: 13, fontWeight: 700, color: "#5A6472", marginTop: 12, marginBottom: 4, textAlign: "center" }}>Detalhamento</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                background: "#fff", border: "1px solid #E4E7EB", borderRadius: 14,
                boxShadow: "0 2px 8px rgba(27,36,48,0.06)", padding: 20,
                width: "100%", maxWidth: 480,
              }}
            >
              {[
                { key: "receita", icon: "💵", label: "Receita bruta", valor: dashboardGeralReport.receitaBruta, cor: "#1B2430", sinal: "" },
                { key: "comissoes", icon: "👤", label: "Comissões", valor: dashboardGeralReport.comissoes, cor: "#B0402E", sinal: "− " },
                { key: "gastos", icon: "🧾", label: "Gastos extras (Despesas Estrada)", valor: dashboardGeralReport.gastosExtrasEstrada, cor: "#B0402E", sinal: "− " },
                { key: "boletos", icon: "🧾", label: `Boletos pagos (${dashboardGeralReport.boletosPagos.length})`, valor: dashboardGeralReport.boletosDespesa, cor: "#B0402E", sinal: "− " },
                { key: "taxa", icon: "🤝", label: "Taxa de viagem (rateio)", valor: dashboardGeralReport.taxaViagem, cor: "#B0402E", sinal: "− " },
              ].map((linha) => (
                <div
                  key={linha.key}
                  onClick={() => setDashboardGeralSecaoAberta(dashboardGeralSecaoAberta === linha.key ? null : linha.key)}
                  className="linha-clicavel"
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, color: "#5A6472",
                    marginBottom: 10, cursor: "pointer", borderRadius: 8, padding: "6px 8px", margin: "0 -8px 4px",
                    background: dashboardGeralSecaoAberta === linha.key ? "#F7F8F9" : "transparent",
                  }}
                >
                  <span>{linha.icon} {linha.label} {dashboardGeralSecaoAberta === linha.key ? "▾" : "▸"}</span>
                  <strong style={{ color: linha.cor }}>{linha.sinal}{BRL(linha.valor)}</strong>
                </div>
              ))}
              <div
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10,
                  background: dashboardGeralReport.rendimentoLiquidoGeral >= 0 ? "#E9F5F1" : "#FBEBE8", borderRadius: 10, padding: "10px 14px",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: dashboardGeralReport.rendimentoLiquidoGeral >= 0 ? "#12503F" : "#7A2A1D" }}>
                  {dashboardGeralReport.rendimentoLiquidoGeral >= 0 ? "📈" : "📉"} Rendimento líquido geral
                </span>
                <strong style={{ fontSize: 17, color: dashboardGeralReport.rendimentoLiquidoGeral >= 0 ? "#12503F" : "#7A2A1D" }}>{BRL(dashboardGeralReport.rendimentoLiquidoGeral)}</strong>
              </div>
            </div>
          </div>

          {dashboardGeralSecaoAberta === "receita" && (
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#5A6472" }}>Viagens consideradas na receita bruta</div>
                <Field label="Ordenar por">
                  <select style={inputStyle} value={dashboardGeralOrdenacao} onChange={(e) => setDashboardGeralOrdenacao(e.target.value)}>
                    <option value="data">Data</option>
                    <option value="motorista">Motorista</option>
                  </select>
                </Field>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E4E7EB", borderRadius: 12, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F7F8F9" }}>
                      <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Data</th>
                      <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Caminhão</th>
                      <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Empresa</th>
                      <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Motorista</th>
                      <th style={{ textAlign: "right", padding: "8px 12px", color: "#5A6472" }}>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...dashboardGeralReport.tripsNoPeriodo]
                      .sort((a, b) =>
                        dashboardGeralOrdenacao === "motorista"
                          ? (a.motorista || "").localeCompare(b.motorista || "") || (a.data || "").localeCompare(b.data || "")
                          : (a.data || "").localeCompare(b.data || "")
                      )
                      .map((t, i) => (
                      <tr key={t.id} style={{ background: i % 2 === 0 ? "#fff" : "#F7F8F9" }}>
                        <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>{fmtDate(t.data)}</td>
                        <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>{truckLabel(t.caminhaoId)}</td>
                        <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2" }}>{t.empresa}</td>
                        <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>{t.motorista || "—"}</td>
                        <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", textAlign: "right", fontWeight: 700 }}>{BRL(valorTotal(t))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {dashboardGeralSecaoAberta === "comissoes" && (
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#5A6472" }}>Comissões geradas nesse período</div>
                <Field label="Ordenar por">
                  <select style={inputStyle} value={dashboardGeralOrdenacao} onChange={(e) => setDashboardGeralOrdenacao(e.target.value)}>
                    <option value="data">Data</option>
                    <option value="motorista">Motorista</option>
                  </select>
                </Field>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E4E7EB", borderRadius: 12, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F7F8F9" }}>
                      <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Data</th>
                      <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Caminhão</th>
                      <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Empresa</th>
                      <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Motorista</th>
                      <th style={{ textAlign: "right", padding: "8px 12px", color: "#5A6472" }}>Comissão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardGeralReport.tripsNoPeriodo
                      .filter((t) => comissao(t) > 0)
                      .sort((a, b) =>
                        dashboardGeralOrdenacao === "motorista"
                          ? (a.motorista || "").localeCompare(b.motorista || "") || (a.data || "").localeCompare(b.data || "")
                          : (a.data || "").localeCompare(b.data || "")
                      )
                      .map((t, i) => (
                      <tr key={t.id} style={{ background: i % 2 === 0 ? "#fff" : "#F7F8F9" }}>
                        <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>{fmtDate(t.data)}</td>
                        <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>{truckLabel(t.caminhaoId)}</td>
                        <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2" }}>{t.empresa}</td>
                        <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>{t.motorista || "—"}</td>
                        <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", textAlign: "right", fontWeight: 700 }}>{BRL(comissao(t))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {dashboardGeralSecaoAberta === "gastos" && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#5A6472", marginBottom: 8 }}>Gastos extras (Despesas Estrada) considerados</div>
              {dashboardGeralReport.gastosExtrasLista.length === 0 ? (
                <div style={{ padding: "20px 10px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 12 }}>Nenhum gasto extra nesse período.</div>
              ) : (
                <div style={{ background: "#fff", border: "1px solid #E4E7EB", borderRadius: 12, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#F7F8F9" }}>
                        <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Data</th>
                        <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Caminhão</th>
                        <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Empresa</th>
                        <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Descrição</th>
                        <th style={{ textAlign: "right", padding: "8px 12px", color: "#5A6472" }}>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardGeralReport.gastosExtrasLista.map((g, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#F7F8F9" }}>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>{fmtDate(g.data)}</td>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>{truckLabel(g.caminhaoId)}</td>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2" }}>{g.empresa}</td>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>{g.descricao || "—"}</td>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", textAlign: "right", fontWeight: 700 }}>{BRL(g.valor)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {dashboardGeralSecaoAberta === "taxa" && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#5A6472", marginBottom: 8 }}>Taxa de viagem (rateio) considerada</div>
              {dashboardGeralReport.taxaViagemLista.length === 0 ? (
                <div style={{ padding: "20px 10px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 12 }}>Nenhuma taxa de viagem nesse período.</div>
              ) : (
                <div style={{ background: "#fff", border: "1px solid #E4E7EB", borderRadius: 12, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#F7F8F9" }}>
                        <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Data</th>
                        <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Caminhão</th>
                        <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Descrição</th>
                        <th style={{ textAlign: "right", padding: "8px 12px", color: "#5A6472" }}>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardGeralReport.taxaViagemLista.map((d, i) => (
                        <tr key={d.id} style={{ background: i % 2 === 0 ? "#fff" : "#F7F8F9" }}>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>{fmtDate(d.data)}</td>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2" }}>{truckLabel(d.caminhaoId)}</td>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>{d.descricao || "—"}</td>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", textAlign: "right", fontWeight: 700 }}>{BRL(Number(d.valor) || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {dashboardGeralSecaoAberta === "boletos" && dashboardGeralReport.boletosPagos.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#5A6472" }}>Boletos considerados nesse período</div>
                <Field label="Ordenar por">
                  <select style={inputStyle} value={dashboardGeralOrdenacaoBoletos} onChange={(e) => setDashboardGeralOrdenacaoBoletos(e.target.value)}>
                    <option value="data">Data</option>
                    <option value="empresa">Empresa</option>
                  </select>
                </Field>
              </div>
              {(() => {
                const foraDoPeriodo = dashboardGeralReport.boletosPagos.filter((b) => {
                  const venc = b.novoVencimento || b.dataVencimento;
                  return venc < dashboardGeralPeriodStart || venc > dashboardGeralPeriodEnd;
                });
                if (foraDoPeriodo.length === 0) return null;
                const totalFora = foraDoPeriodo.reduce((s, b) => s + b.valorEvento, 0);
                return (
                  <div style={{ background: "#FFF6E2", border: "1px solid #D9A419", borderRadius: 10, padding: "8px 12px", marginBottom: 8, fontSize: 12, color: "#8A5A00" }}>
                    ⚠️ {foraDoPeriodo.length} {foraDoPeriodo.length === 1 ? "pagamento é" : "pagamentos são"} de {foraDoPeriodo.length === 1 ? "um boleto cujo" : "boletos cujo"} vencimento
                    (ou novo vencimento) <strong>não</strong> é desse período — somam {BRL(totalFora)}. Esses são o motivo desse
                    valor não bater com o cartão "Pago" da tela de Boletos, que só olha o vencimento. Estão marcados em amarelo abaixo.
                  </div>
                );
              })()}
              <div style={{ background: "#fff", border: "1px solid #E4E7EB", borderRadius: 12, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F7F8F9" }}>
                      <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Empresa</th>
                      <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Categoria</th>
                      <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Descrição</th>
                      <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Vencimento</th>
                      <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Pago em</th>
                      <th style={{ textAlign: "right", padding: "8px 12px", color: "#5A6472" }}>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...dashboardGeralReport.boletosPagos]
                      .sort((a, b) =>
                        dashboardGeralOrdenacaoBoletos === "empresa"
                          ? (a.empresa || "").localeCompare(b.empresa || "") || (a.dataEvento || "").localeCompare(b.dataEvento || "")
                          : (a.dataEvento || "").localeCompare(b.dataEvento || "")
                      )
                      .map((b, i) => {
                      const empresaCadastro = empresas.find((e) => e.nome === b.empresa);
                      const venc = b.novoVencimento || b.dataVencimento;
                      const vencForaDoPeriodo = venc < dashboardGeralPeriodStart || venc > dashboardGeralPeriodEnd;
                      return (
                        <tr key={`${b.id}-${b.dataEvento}-${i}`} style={{ background: vencForaDoPeriodo ? "#FFF6E2" : i % 2 === 0 ? "#fff" : "#F7F8F9" }}>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2" }}>{b.empresa}</td>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>{(empresaCadastro && empresaCadastro.categoria) || "—"}</td>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>
                            {b.descricao || ""}
                            {b.ehBaixaParcial && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: "#8A5A00" }}>baixa parcial</span>}
                          </td>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: vencForaDoPeriodo ? "#8A5A00" : "#5A6472", fontWeight: vencForaDoPeriodo ? 700 : 400 }}>
                            {fmtDate(venc)} {vencForaDoPeriodo && "⚠️"}
                          </td>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>{fmtDate(b.dataEvento)}</td>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", textAlign: "right", fontWeight: 700 }}>
                            {BRL(b.valorEvento)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {view === "viagens" && (
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "24px 28px" }}>

        {/* filtros consolidados numa única linha: caminhão, período, status, busca */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap", background: "#fff", border: "1px solid #E4E7EB", borderRadius: 12, padding: 14, marginBottom: 20 }}>
          <Field label="🚛 Caminhão">
            <select style={inputStyle} value={filterTruck} onChange={(e) => setFilterTruck(e.target.value)}>
              <option value="all">Todos os caminhões</option>
              {trucksCavalos.map((tr) => <option key={tr.id} value={tr.id}>{tr.placa}{tr.modelo ? ` — ${tr.modelo}` : ""}</option>)}
            </select>
          </Field>
          <Field label="📅 Período">
            <select style={inputStyle} value={tripListPeriodFilter} onChange={(e) => setTripListPeriodFilter(e.target.value)}>
              <option value="all">Tudo</option>
              <option value="mes">Este mês</option>
              <option value="hoje">Hoje</option>
              <option value="escolher">Escolher mês</option>
            </select>
          </Field>
          {tripListPeriodFilter === "escolher" && (
            <Field label="Mês">
              <input
                type="month"
                value={tripListMesEscolhido}
                onChange={(e) => setTripListMesEscolhido(e.target.value)}
                style={inputStyle}
              />
            </Field>
          )}
          <Field label="📍 Status">
            <select style={inputStyle} value={tripListStatusFilter} onChange={(e) => setTripListStatusFilter(e.target.value)}>
              <option value="all">Todas</option>
              <option value="pendente">Pendentes</option>
              <option value="pago">Pagas</option>
            </select>
          </Field>
          <Field label="Ordenar por">
            <select style={inputStyle} value={tripListSortBy} onChange={(e) => setTripListSortBy(e.target.value)}>
              <option value="data">Data da viagem</option>
              <option value="lancamento">Ordem de lançamento</option>
            </select>
          </Field>
          <div style={{ flex: "1 1 200px" }}>
            <Field label="Buscar">
              <input
                value={tripSearchQuery}
                onChange={(e) => setTripSearchQuery(e.target.value)}
                placeholder="🔍 Buscar viagem (origem, destino, motorista, contrato)..."
                style={{ ...inputStyle, width: "100%" }}
              />
            </Field>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <button
            onClick={openNewTrip}
            style={{
              background: "#2451A6",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 18px",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              letterSpacing: 0.3,
            }}
          >
            + Lançar viagem
          </button>
        </div>

        {/* stats */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          <div style={{ flex: "0 0 140px" }}><MileSign label="Viagens" value={stats.count} tone="blue" icon="🚚" full /></div>
          <div style={{ flex: "1 1 0", minWidth: 200 }}><MileSign label="A receber" value={BRL(stats.totalReceber)} tone="red" icon="⏳" onClick={() => setStatsDetailOpen("receber")} full /></div>
          <div style={{ flex: "1 1 0", minWidth: 200 }}>
          <MileSign
            label="Recebido"
            value={BRL(stats.totalRecebido)}
            tone="green"
            icon="✅"
            onClick={() => setStatsDetailOpen("recebido")}
            full
            caption={
              tripListPeriodFilter === "mes" ? "este mês" :
              tripListPeriodFilter === "hoje" ? "hoje" :
              tripListPeriodFilter === "escolher" ? tripListMesEscolhido :
              "tudo"
            }
          />
          </div>
          <div style={{ flex: "1 1 0", minWidth: 200 }}>
          <MileSign
            label="Comissão"
            value={BRL(
              comissaoCardModo === "pendente" ? totalComissao :
              comissaoCardModo === "saldo" ? totalSaldoDevido :
              totalComissaoGeral
            )}
            tone="amber"
            icon="💰"
            onClick={() => setStatsDetailOpen("comissao")}
            full
            caption={
              comissaoCardModo === "pendente" ? "pendente de fechar" :
              comissaoCardModo === "saldo" ? "saldo devido a todos os motoristas" :
              "total gerado (pago + pendente)"
            }
            toggle={
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <button
                  onClick={() => setComissaoCardModo("pendente")}
                  style={{
                    fontSize: 10,
                    padding: "3px 8px",
                    borderRadius: 6,
                    border: "1px solid #D9A41966",
                    background: comissaoCardModo === "pendente" ? "#D9A419" : "transparent",
                    color: comissaoCardModo === "pendente" ? "#1B2430" : "#8A5A00",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Pendente
                </button>
                <button
                  onClick={() => setComissaoCardModo("saldo")}
                  style={{
                    fontSize: 10,
                    padding: "3px 8px",
                    borderRadius: 6,
                    border: "1px solid #D9A41966",
                    background: comissaoCardModo === "saldo" ? "#D9A419" : "transparent",
                    color: comissaoCardModo === "saldo" ? "#1B2430" : "#8A5A00",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Saldo devido
                </button>
                <button
                  onClick={() => setComissaoCardModo("geral")}
                  style={{
                    fontSize: 10,
                    padding: "3px 8px",
                    borderRadius: 6,
                    border: "1px solid #D9A41966",
                    background: comissaoCardModo === "geral" ? "#D9A419" : "transparent",
                    color: comissaoCardModo === "geral" ? "#1B2430" : "#8A5A00",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Total geral
                </button>
              </div>
            }
          />
          </div>
        </div>

        {/* trips list */}
        {tripsParaExibir.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "40px 20px",
              textAlign: "center",
              color: "#5A6472",
              border: "1px dashed #D7DBE0",
            }}
          >
            {trips.length === 0 ? (
              <>Nenhuma viagem lançada ainda. Toque em <strong>+ Lançar viagem</strong> para começar.</>
            ) : (
              <>Nenhuma viagem encontrada com esse filtro.</>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tripsParaExibir.map((t) => {
              const pago = isTripPago(t);
              const aReceber = !pago && (Number(t.adiantamento) > 0 || Number(t.saldoReceber) > 0);
              const badgeCor = pago ? "#1F6F5C" : aReceber ? "#B0402E" : "#D9A419";
              const badgeBg = pago ? "#E9F5F1" : aReceber ? "#FBEBE8" : "#FFF6E2";
              const badgeTexto = pago ? "PAGO" : aReceber ? "A RECEBER" : "PENDENTE";
              return (
                <div
                  key={t.id}
                  className="linha-clicavel"
                  onClick={() => openEditTrip(t)}
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    padding: "16px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(27,36,48,0.06)",
                    border: "1px solid #E4E7EB",
                    borderLeft: `4px solid ${badgeCor}`,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <PlateChip placa={truckLabel(t.caminhaoId)} size="sm" active={false} onClick={() => {}} />
                    {t.contrato && (
                      <div style={{ fontSize: 10, color: "#9AA5B1", fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums" }}>
                        Ctr {t.contrato}
                      </div>
                    )}
                  </div>
                  <div style={{ minWidth: 90, fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums", fontSize: 13, color: "#5A6472" }}>
                    <div>📅 {fmtDate(t.data)}</div>
                    {t.dataFim && (
                      <div style={{ fontSize: 11, color: "#9AA5B1" }}>
                        até {fmtDate(t.dataFim)}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: "1 1 220px", fontSize: 14 }}>
                    <div>📍 <strong>{t.origem || "?"}</strong> → <strong>{t.destino || "?"}</strong></div>
                    <div style={{ fontSize: 12, color: "#5A6472", marginTop: 2 }}>
                      {t.empresa} {t.motorista && <>· 👤 {t.motorista}</>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums" }}>
                    <div style={{ fontWeight: 700 }}>{BRL(valorTotal(t))}</div>
                    <div style={{ fontSize: 11, color: "#5A6472" }}>comissão {BRL(comissao(t))}</div>
                    {Number(t.carregamento) > 0 && (
                      <div style={{ fontSize: 11, color: "#8A5A00" }}>
                        carregamento {BRL(Number(t.carregamento))}{t.carregamentoMotorista && ` (${t.carregamentoMotorista})`}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 20,
                      color: badgeCor,
                      background: badgeBg,
                    }}
                  >
                    {badgeTexto}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {view === "boletos" && (
        <BoletosView
          boletos={boletos}
          onSave={saveBoleto}
          onSaveMultiple={saveBoletosMultiple}
          onDelete={deleteBoleto}
          reportOpen={boletosReportOpen}
          setReportOpen={setBoletosReportOpen}
          periodStart={boletosPeriodStart}
          setPeriodStart={setBoletosPeriodStart}
          periodEnd={boletosPeriodEnd}
          setPeriodEnd={setBoletosPeriodEnd}
          empresasSelecionadas={boletosEmpresasSelecionadas}
          onToggleEmpresaSelecionada={toggleEmpresaSelecionada}
          onMarcarTodasEmpresas={marcarTodasEmpresas}
          onDesmarcarTodasEmpresas={desmarcarTodasEmpresas}
          onResetEmpresasParaPadrao={resetEmpresasParaPadrao}
          statusReportFilter={boletosReportStatus}
          setStatusReportFilter={setBoletosReportStatus}
          empresasList={boletosEmpresas}
          report={boletosReport}
          exportCSV={exportBoletosCSV}
          empresas={empresas}
          onAddEmpresa={addEmpresa}
          onRemoveEmpresa={removeEmpresa}
          onRenameEmpresa={renomearEmpresa}
          onSetCategoriaEmpresa={setCategoriaEmpresa}
          onSetCategoriaEmpresaPorNome={setCategoriaEmpresaPorNome}
          onSetIncluirRelatorioEmpresa={setIncluirRelatorioEmpresa}
          categoriasEmpresaLista={categoriasEmpresaLista}
          onAdicionarCategoriaEmpresa={adicionarCategoriaEmpresa}
          onRenomearCategoriaEmpresa={renomearCategoriaEmpresa}
          onRemoverCategoriaEmpresa={removerCategoriaEmpresa}
          contasList={contasBancariasList}
          onAddConta={addConta}
          boletoParaAbrirId={boletoParaAbrirId}
          onBoletoAberto={() => { setBoletoParaAbrirId(null); }}
        />
      )}

      {/* detalhe de a receber / recebido */}
      {statsDetailOpen && (
        <div
          onClick={() => setStatsDetailOpen(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-relatorio" style={{
              width: "min(600px, 94vw)",
              maxHeight: "88vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: 14,
              zIndex: 21,
              boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
              padding: 24,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 22 }}>
                {statsDetailOpen === "receber" ? "Viagens a receber" : statsDetailOpen === "recebido" ? "Viagens recebidas" : "Comissão por motorista"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {(statsDetailOpen === "receber" || statsDetailOpen === "recebido" || statsDetailOpen === "comissao") && (
                  <button
                    onClick={() => window.print()}
                    style={{ background: "#2451A6", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                  >
                    Baixar PDF
                  </button>
                )}
                <button
                  onClick={() => setStatsDetailOpen(null)}
                  style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            </div>

            {statsDetailOpen === "receber" ? (
              pendingList.length === 0 ? (
                <div style={{ padding: "20px 0", textAlign: "center", color: "#5A6472" }}>
                  Nenhuma viagem com valor pendente. 🎉
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {pendingList.map((r) => (
                    <div
                      key={r.trip.id}
                      className="linha-clicavel"
                      onClick={() => { setStatsDetailOpen(null); openEditTrip(r.trip); }}
                      style={{ background: "#FBEBE8", border: r.semValorPreenchido ? "1px solid #B0402E" : "none", borderRadius: 12, padding: "10px 14px", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                        <strong>{truckLabel(r.trip.caminhaoId)} · {fmtDate(r.trip.data)}{r.trip.contrato && ` · Ctr ${r.trip.contrato}`}</strong>
                        {r.semValorPreenchido ? (
                          <span style={{ fontWeight: 700, color: "#B0402E" }}>⚠️ falta valor</span>
                        ) : (
                          <span style={{ fontWeight: 700, color: "#B0402E" }}>{BRL(r.pendTotal)}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "#5A6472" }}>
                        {r.trip.origem} → {r.trip.destino} {r.trip.empresa && `· ${r.trip.empresa}`}
                      </div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>
                        {r.pendAdiantamento > 0 && <span>Adiantamento pendente: {BRL(r.pendAdiantamento)}  </span>}
                        {r.pendSaldo > 0 && <span>Saldo pendente: {BRL(r.pendSaldo)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : statsDetailOpen === "recebido" ? (
              receivedList.length === 0 ? (
                <div style={{ padding: "20px 0", textAlign: "center", color: "#5A6472" }}>
                  Nenhum recebimento registrado ainda.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {receivedList.map((r, i) => (
                    <div
                      key={i}
                      className="linha-clicavel"
                      onClick={() => { setStatsDetailOpen(null); openEditTrip(r.trip); }}
                      style={{ background: "#E9F5F1", borderRadius: 12, padding: "10px 14px", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                        <strong>{truckLabel(r.trip.caminhaoId)} · recebido em {fmtDate(r.data)}{r.trip.contrato && ` · Ctr ${r.trip.contrato}`}</strong>
                        <span style={{ fontWeight: 700, color: "#12503F" }}>{BRL(r.valor)}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#5A6472" }}>
                        {r.trip.origem} → {r.trip.destino} {r.trip.empresa && `· ${r.trip.empresa}`} · {r.tipo}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <>
                {commissionByDriver.length > 0 && (
                  <Field label="Motorista">
                    <select
                      style={{ ...inputStyle, marginBottom: 16 }}
                      value={commissionDriverFilter}
                      onChange={(e) => setCommissionDriverFilter(e.target.value)}
                    >
                      <option value="all">Todos os motoristas</option>
                      {commissionByDriver.map((g) => (
                        <option key={g.motorista} value={g.motorista}>{g.motorista}</option>
                      ))}
                    </select>
                  </Field>
                )}
                {motoristasDuplicados.length > 0 && (
                  <div style={{ background: "#FBEBE8", border: "1px solid #B0402E33", borderRadius: 12, padding: 12, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: "#7A2A1D", marginBottom: 8 }}>
                      Encontrei {motoristasDuplicados.length} {motoristasDuplicados.length === 1 ? "motorista" : "motoristas"} com nome grafado de mais de um jeito (ex: maiúsculo/minúsculo) — isso pode estar dividindo a comissão da mesma pessoa em duas.
                    </div>
                    <button
                      onClick={unificarMotoristas}
                      style={{ background: "#B0402E", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                    >
                      Unificar nomes duplicados
                    </button>
                  </div>
                )}
                <NovoMotoristaForm
                  visible={addingValeFor === "__novo__"}
                  onCancel={() => setAddingValeFor(null)}
                  onConfirm={(nome, data, valor, tipo, obs) => {
                    if (!nome.trim() || !valor || Number(valor) <= 0) return;
                    addVale(nome.trim(), data, valor, tipo, obs);
                    setAddingValeFor(null);
                  }}
                  inputStyle={inputStyle}
                />
                {addingValeFor !== "__novo__" && (
                  <button
                    onClick={() => setAddingValeFor("__novo__")}
                    style={{ border: "2px dashed #B7BFC8", background: "transparent", borderRadius: 10, padding: "7px 14px", fontSize: 13, color: "#5A6472", cursor: "pointer", marginBottom: 16 }}
                  >
                    + motorista novo (sem viagem lançada ainda)
                  </button>
                )}
                {commissionByDriver.filter((g) => commissionDriverFilter === "all" || g.motorista === commissionDriverFilter).length === 0 ? (
                  <div style={{ padding: "20px 0", textAlign: "center", color: "#5A6472" }}>
                    Nenhuma comissão calculada ainda.
                  </div>
                ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {commissionByDriver
                  .filter((g) => commissionDriverFilter === "all" || g.motorista === commissionDriverFilter)
                  .map((g) => (
                  <div key={g.motorista}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{g.motorista}</div>
                      {g.saldo !== 0 && (g.trips.length > 0 || g.vales.length > 0) && fechandoMotorista !== g.motorista && (
                        <button
                          onClick={() => startFecharSaldo(g.motorista)}
                          style={{ fontSize: 11, background: "#1B2430", color: "#fff", border: "none", borderRadius: 10, padding: "6px 10px", fontWeight: 700, cursor: "pointer" }}
                        >
                          Fechar saldo ({BRL(g.saldo)})
                        </button>
                      )}
                    </div>

                    {fechandoMotorista === g.motorista && (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end", background: "#F7F8F9", padding: 10, borderRadius: 12, marginBottom: 10 }}>
                        <Field label="Data do pagamento/acerto">
                          <input type="date" style={inputStyle} value={fechamentoDataEditavel} onChange={(e) => setFechamentoDataEditavel(e.target.value)} onBlur={(e) => setFechamentoDataEditavel(corrigirAnoDigitado(e.target.value))} />
                        </Field>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#5A6472" }}>Valor: {BRL(g.saldo)}</div>
                        <button onClick={() => confirmFecharSaldo(g.saldo, g.trips, g.vales)} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, cursor: "pointer" }}>
                          Confirmar fechamento
                        </button>
                        <button onClick={() => setFechandoMotorista(null)} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}>
                          Cancelar
                        </button>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                      <div style={{ flex: "1 1 90px", background: "#FFF6E2", borderRadius: 10, padding: "6px 10px" }}>
                        <div style={{ fontSize: 10, color: "#8A5A00", textTransform: "uppercase" }}>Gerado</div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{BRL(g.total)}</div>
                      </div>
                      <div style={{ flex: "1 1 90px", background: "#FFF6E2", borderRadius: 10, padding: "6px 10px" }}>
                        <div style={{ fontSize: 10, color: "#8A5A00", textTransform: "uppercase" }}>Reembolsos</div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>+{BRL(g.totalReembolso)}</div>
                      </div>
                      <div style={{ flex: "1 1 90px", background: "#E9F5F1", borderRadius: 10, padding: "6px 10px" }}>
                        <div style={{ fontSize: 10, color: "#12503F", textTransform: "uppercase" }}>Pago (vales)</div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>−{BRL(g.totalPago)}</div>
                      </div>
                      <div style={{ flex: "1 1 90px", background: g.saldo > 0 ? "#FBEBE8" : "#E9F5F1", borderRadius: 10, padding: "6px 10px" }}>
                        <div style={{ fontSize: 10, color: g.saldo > 0 ? "#7A2A1D" : "#12503F", textTransform: "uppercase" }}>Saldo devido</div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: g.saldo > 0 ? "#B0402E" : "#12503F" }}>{BRL(g.saldo)}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: 11, color: "#5A6472", fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Viagens</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                      {g.trips.map(({ trip, valor, semValorPreenchido }) => (
                        <div
                          key={trip.id}
                          className="linha-clicavel"
                          onClick={() => { setStatsDetailOpen(null); openEditTrip(trip); }}
                          style={{ background: semValorPreenchido ? "#FBEBE8" : "#FFF6E2", border: semValorPreenchido ? "1px solid #B0402E" : "none", borderRadius: 12, padding: "8px 12px", cursor: "pointer", fontSize: 12 }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <strong>{truckLabel(trip.caminhaoId)} · {fmtDate(trip.data)}</strong>
                            {semValorPreenchido ? (
                              <span style={{ fontWeight: 700, color: "#B0402E" }}>⚠️ falta valor</span>
                            ) : (
                              <span style={{ fontWeight: 700 }}>{BRL(valor)}</span>
                            )}
                          </div>
                          <div style={{ color: "#5A6472" }}>
                            {trip.origem} → {trip.destino} {trip.empresa && `· ${trip.empresa}`}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ fontSize: 11, color: "#5A6472", fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Vales e reembolsos</div>
                    {g.vales.length === 0 ? (
                      <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 8 }}>Nenhum lançamento registrado ainda.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                        {g.vales.map((v) => {
                          const isReembolso = v.tipo === "reembolso";
                          return (
                            <div key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: isReembolso ? "#FFF6E2" : "#E9F5F1", borderRadius: 12, padding: "7px 12px", fontSize: 12 }}>
                              <div>
                                <span style={{ fontWeight: 700, fontSize: 10, textTransform: "uppercase", color: isReembolso ? "#8A5A00" : "#12503F", marginRight: 6 }}>
                                  {isReembolso ? "Reembolso" : "Vale"}
                                </span>
                                <strong>{fmtDate(v.data)}</strong> — {isReembolso ? "+" : "−"}{BRL(Number(v.valor) || 0)}
                                {v.observacao && <span style={{ color: "#5A6472" }}> · {v.observacao}</span>}
                              </div>
                              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <button
                                  onClick={() => startEditVale(v)}
                                  title="Editar lançamento"
                                  style={{ background: "none", border: "none", color: "#2451A6", cursor: "pointer", fontSize: 12 }}
                                >
                                  editar
                                </button>
                                <button
                                  onClick={() => deleteVale(v.id)}
                                  title="Remover lançamento"
                                  style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 14 }}
                                >
                                  ×
                                </button>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {g.valesFuturos.length > 0 && (
                      <>
                        <div style={{ fontSize: 11, color: "#5A6472", fontWeight: 700, marginBottom: 4, marginTop: 10, textTransform: "uppercase" }}>
                          Lançamentos futuros (agendados, ainda não entram no saldo)
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                          {g.valesFuturos.map((v) => {
                            const isReembolso = v.tipo === "reembolso";
                            return (
                              <div key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F2F3F4", border: "1px dashed #B7BFC8", borderRadius: 12, padding: "7px 12px", fontSize: 12 }}>
                                <div>
                                  <span style={{ fontWeight: 700, fontSize: 10, textTransform: "uppercase", color: "#5A6472", marginRight: 6 }}>
                                    {isReembolso ? "Reembolso" : "Vale"} agendado
                                  </span>
                                  <strong>{fmtDate(v.data)}</strong> — {isReembolso ? "+" : "−"}{BRL(Number(v.valor) || 0)}
                                  {v.observacao && <span style={{ color: "#5A6472" }}> · {v.observacao}</span>}
                                </div>
                                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <button
                                    onClick={() => startEditVale(v)}
                                    title="Editar lançamento"
                                    style={{ background: "none", border: "none", color: "#2451A6", cursor: "pointer", fontSize: 12 }}
                                  >
                                    editar
                                  </button>
                                  <button
                                    onClick={() => deleteVale(v.id)}
                                    title="Remover lançamento"
                                    style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 14 }}
                                  >
                                    ×
                                  </button>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {addingValeFor === g.motorista ? (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-end", background: "#F7F8F9", padding: 10, borderRadius: 12 }}>
                        <Field label="Tipo">
                          <select style={inputStyle} value={valeTipo} onChange={(e) => setValeTipo(e.target.value)}>
                            <option value="vale">Vale (adiantamento pago a ele)</option>
                            <option value="reembolso">Reembolso (ele pagou, devemos a ele)</option>
                          </select>
                        </Field>
                        <Field label="Data">
                          <input type="date" style={inputStyle} value={valeData} onChange={(e) => setValeData(e.target.value)} onBlur={(e) => setValeData(corrigirAnoDigitado(e.target.value))} />
                        </Field>
                        <Field label="Valor (R$)">
                          <input type="number" style={{ ...inputStyle, width: 100 }} value={valeValor} onChange={(e) => setValeValor(e.target.value)} />
                        </Field>
                        <Field label="Observação (opcional)">
                          <input style={{ ...inputStyle, width: 140 }} value={valeObs} onChange={(e) => setValeObs(e.target.value)} />
                        </Field>
                        {!editingValeId && (
                          <Field label="Repetir por (meses)">
                            <input
                              type="number"
                              min="1"
                              style={{ ...inputStyle, width: 90 }}
                              value={valeRepetirMeses}
                              onChange={(e) => setValeRepetirMeses(e.target.value)}
                              placeholder="1"
                              title="Ex: 12 para descontar em 12 parcelas mensais (moto, empréstimo, etc.). Em branco = não repete."
                            />
                          </Field>
                        )}
                        <button onClick={confirmAddVale} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, cursor: "pointer" }}>
                          {editingValeId ? "Salvar edição" : "Salvar"}
                        </button>
                        <button onClick={() => { setAddingValeFor(null); setEditingValeId(null); }} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startAddVale(g.motorista)}
                        style={{ border: "2px dashed #B7BFC8", background: "transparent", borderRadius: 10, padding: "7px 14px", fontSize: 13, color: "#5A6472", cursor: "pointer" }}
                      >
                        + registrar vale ou reembolso
                      </button>
                    )}

                    {g.historico.length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <button
                          onClick={() => toggleHistorico(g.motorista)}
                          style={{ fontSize: 11, color: "#5A6472", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
                        >
                          {historicoExpandido[g.motorista] ? "ocultar" : "ver"} histórico de fechamentos ({g.historico.length})
                        </button>
                        {historicoExpandido[g.motorista] && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                            {g.historico.map((f) => (
                              <div key={f.id} style={{ background: "#F2F3F4", borderRadius: 12, padding: "10px 12px", fontSize: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editandoFechamentoId === f.id ? 8 : 0 }}>
                                  <span>
                                    Fechado em <strong>{fmtDate(f.data)}</strong> — {BRL(Number(f.valor) || 0)}
                                  </span>
                                  <span style={{ display: "flex", gap: 10 }}>
                                    {editandoFechamentoId !== f.id && ajustandoFechamentoId !== f.id && (
                                      <button
                                        onClick={() => startEditFechamentoData(f)}
                                        style={{ background: "none", border: "none", color: "#2451A6", cursor: "pointer", fontSize: 11, textDecoration: "underline" }}
                                      >
                                        editar data
                                      </button>
                                    )}
                                    {editandoFechamentoId !== f.id && ajustandoFechamentoId !== f.id && (f.trips.length > 0 || f.vales.length > 0) && (
                                      <button
                                        onClick={() => startAjustarFechamento(f)}
                                        title="Use se algum lançamento entrou errado nesse fechamento (ex: viagem do mesmo dia que não tinha valor ainda)"
                                        style={{ background: "none", border: "none", color: "#8A5A00", cursor: "pointer", fontSize: 11, textDecoration: "underline" }}
                                      >
                                        ajustar lançamentos
                                      </button>
                                    )}
                                    <button
                                      onClick={() => { if (window.confirm("Desfazer este fechamento? Os lançamentos voltam a aparecer como em aberto.")) deleteFechamento(f.id); }}
                                      title="Desfazer fechamento"
                                      style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 11, textDecoration: "underline" }}
                                    >
                                      desfazer
                                    </button>
                                  </span>
                                </div>

                                {editandoFechamentoId === f.id && (
                                  <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 8 }}>
                                    <Field label="Nova data do pagamento">
                                      <input type="date" style={inputStyle} value={editandoFechamentoData} onChange={(e) => setEditandoFechamentoData(e.target.value)} onBlur={(e) => setEditandoFechamentoData(corrigirAnoDigitado(e.target.value))} />
                                    </Field>
                                    <button onClick={() => confirmEditFechamentoData(g.motorista)} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "7px 12px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
                                      Salvar
                                    </button>
                                    <button onClick={() => setEditandoFechamentoId(null)} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 10, padding: "7px 12px", cursor: "pointer", fontSize: 12 }}>
                                      Cancelar
                                    </button>
                                  </div>
                                )}

                                {ajustandoFechamentoId === f.id && (
                                  <div style={{ background: "#FFF6E2", border: "1px solid #D9A419", borderRadius: 12, padding: 10, marginBottom: 8 }}>
                                    <div style={{ fontSize: 11, color: "#8A5A00", marginBottom: 8 }}>
                                      Desmarca o que <strong>não</strong> foi realmente pago nesse fechamento (ex: viagem do mesmo dia que ainda não tinha valor de comissão na hora). O que ficar desmarcado volta a aparecer como pendente.
                                    </div>
                                    {f.trips.map(({ trip, valor }) => (
                                      <label key={trip.id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 10, padding: "5px 8px", marginBottom: 4, cursor: "pointer" }}>
                                        <input
                                          type="checkbox"
                                          checked={ajusteTripIds.includes(trip.id)}
                                          onChange={(e) => setAjusteTripIds((prev) => e.target.checked ? [...prev, trip.id] : prev.filter((id) => id !== trip.id))}
                                        />
                                        <span style={{ flex: 1 }}>{fmtDate(trip.data)} · {truckLabel(trip.caminhaoId)} · {trip.origem} → {trip.destino}</span>
                                        <strong>{BRL(valor)}</strong>
                                      </label>
                                    ))}
                                    {f.vales.map((v) => (
                                      <label key={v.id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 10, padding: "5px 8px", marginBottom: 4, cursor: "pointer" }}>
                                        <input
                                          type="checkbox"
                                          checked={ajusteValeIds.includes(v.id)}
                                          onChange={(e) => setAjusteValeIds((prev) => e.target.checked ? [...prev, v.id] : prev.filter((id) => id !== v.id))}
                                        />
                                        <span style={{ flex: 1 }}>{fmtDate(v.data)} · {v.tipo === "reembolso" ? "Reembolso" : "Vale"} {v.observacao && `· ${v.observacao}`}</span>
                                        <strong>{v.tipo === "reembolso" ? "+" : "−"}{BRL(Number(v.valor) || 0)}</strong>
                                      </label>
                                    ))}
                                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                      <button onClick={confirmAjustarFechamento} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "7px 12px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
                                        Salvar ajuste
                                      </button>
                                      <button onClick={() => setAjustandoFechamentoId(null)} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 10, padding: "7px 12px", cursor: "pointer", fontSize: 12 }}>
                                        Cancelar
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {(f.trips.length > 0 || f.vales.length > 0) && ajustandoFechamentoId !== f.id && (
                                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6 }}>
                                    {f.trips.map(({ trip, valor }) => (
                                      <div key={trip.id} style={{ display: "flex", justifyContent: "space-between", background: "#fff", borderRadius: 10, padding: "5px 8px" }}>
                                        <span>{fmtDate(trip.data)} · {truckLabel(trip.caminhaoId)} · {trip.origem} → {trip.destino}</span>
                                        <strong>{BRL(valor)}</strong>
                                      </div>
                                    ))}
                                    {f.vales.map((v) => (
                                      <div key={v.id} style={{ display: "flex", justifyContent: "space-between", background: "#fff", borderRadius: 10, padding: "5px 8px" }}>
                                        <span>{fmtDate(v.data)} · {v.tipo === "reembolso" ? "Reembolso" : "Vale"} {v.observacao && `· ${v.observacao}`}</span>
                                        <strong>{v.tipo === "reembolso" ? "+" : "−"}{BRL(Number(v.valor) || 0)}</strong>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {/* relatorio mensal */}
      {reportOpen && (
        <div
          onClick={() => setReportOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-relatorio" style={{
              width: "min(760px, 94vw)",
              maxHeight: "88vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: 14,
              zIndex: 21,
              boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
              padding: 24,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => setReportOpen(false)}
                  title="Voltar"
                  style={{ background: "#F7F8F9", border: "none", borderRadius: 10, width: 34, height: 34, fontSize: 16, cursor: "pointer", color: "#3A4351" }}
                >
                  ←
                </button>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 22 }}>
                  Relatório de líquido mensal
                </div>
              </div>
              <button
                onClick={() => setReportOpen(false)}
                style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#5A6472" }}>Mostrando:</span>
              <select
                style={{ ...inputStyle, padding: "6px 10px", fontSize: 12 }}
                value={filterTruck}
                onChange={(e) => setFilterTruck(e.target.value)}
              >
                <option value="all">Todos os caminhões</option>
                {trucksCavalos.map((tr) => (
                  <option key={tr.id} value={tr.id}>{tr.placa}{tr.modelo ? ` — ${tr.modelo}` : ""}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              {addingDespesaFor !== null && editingDespesaId === null ? (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-end", background: "#F7F8F9", padding: 10, borderRadius: 12 }}>
                  <Field label="Caminhão">
                    <select style={inputStyle} value={addingDespesaFor} onChange={(e) => setAddingDespesaFor(e.target.value)}>
                      {trucksCavalos.map((tr) => <option key={tr.id} value={tr.id}>{tr.placa}</option>)}
                    </select>
                  </Field>
                  <Field label="Data">
                    <input type="date" style={inputStyle} value={despesaData} onChange={(e) => setDespesaData(e.target.value)} onBlur={(e) => setDespesaData(corrigirAnoDigitado(e.target.value))} />
                  </Field>
                  <Field label="Descrição">
                    <input style={inputStyle} value={despesaDescricao} onChange={(e) => setDespesaDescricao(e.target.value)} placeholder="ex: Seguro, Sem Parar, taxa" />
                  </Field>
                  <Field label="Valor (R$)">
                    <input type="number" style={{ ...inputStyle, width: 100 }} value={despesaValor} onChange={(e) => setDespesaValor(e.target.value)} />
                  </Field>
                  <Field label="Observação (opcional)">
                    <input style={{ ...inputStyle, width: 140 }} value={despesaObs} onChange={(e) => setDespesaObs(e.target.value)} />
                  </Field>
                  <button onClick={confirmAddDespesa} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, cursor: "pointer" }}>
                    Salvar
                  </button>
                  <button onClick={() => { setAddingDespesaFor(null); setEditingDespesaId(null); }} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}>
                    Cancelar
                  </button>
                </div>
              ) : (
                trucksCavalos.length > 0 && (
                  <button
                    onClick={() => startAddDespesa(filterTruck !== "all" ? filterTruck : trucks[0].id)}
                    style={{ border: "2px dashed #B7BFC8", background: "transparent", borderRadius: 10, padding: "7px 14px", fontSize: 13, color: "#5A6472", cursor: "pointer" }}
                  >
                    + despesa do caminhão (seguro, Sem Parar, taxas...)
                  </button>
                )
              )}
            </div>

            <div style={{ marginBottom: 18, background: "#FFF6E2", borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#8A5A00", textTransform: "uppercase", marginBottom: 8 }}>
                Taxa de viagem do mês (a dividir entre os caminhões)
              </div>

              {taxasDoMesReport.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                  {taxasDoMesReport.map((t) => (
                    <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: 10, padding: "6px 10px", fontSize: 12 }}>
                      <span>{fmtDate(t.data)} {t.descricao && `— ${t.descricao}`}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <strong>{BRL(Number(t.valor) || 0)}</strong>
                        <button onClick={() => startEditTaxa(t)} style={{ background: "none", border: "none", color: "#2451A6", cursor: "pointer", fontSize: 12 }}>editar</button>
                        <button onClick={() => deleteTaxaPool(t.id)} style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 13 }}>×</button>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {addingTaxa ? (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <Field label="Data">
                    <input type="date" style={inputStyle} value={taxaData} onChange={(e) => setTaxaData(e.target.value)} onBlur={(e) => setTaxaData(corrigirAnoDigitado(e.target.value))} />
                  </Field>
                  <Field label="Valor (R$)">
                    <input type="number" style={{ ...inputStyle, width: 100 }} value={taxaValor} onChange={(e) => setTaxaValor(e.target.value)} autoFocus />
                  </Field>
                  <Field label="Pra quem foi pago">
                    <input style={{ ...inputStyle, width: 160 }} value={taxaDescricao} onChange={(e) => setTaxaDescricao(e.target.value)} placeholder="ex: fulano, plataforma tal" />
                  </Field>
                  <button onClick={confirmAddTaxa} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, cursor: "pointer" }}>
                    Salvar
                  </button>
                  <button onClick={() => { setAddingTaxa(false); setEditingTaxaId(null); }} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={startAddTaxa}
                  style={{ border: "2px dashed #C9A227", background: "transparent", borderRadius: 10, padding: "7px 14px", fontSize: 13, color: "#8A5A00", cursor: "pointer" }}
                >
                  + registrar taxa deste mês
                </button>
              )}

              {taxasDoMesReport.length > 0 && trucksCavalos.length > 0 && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #E8D9A8", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ fontSize: 12, color: "#5A6472" }}>
                    Total do mês: <strong>{BRL(taxasDoMesTotal)}</strong> ÷ {trucksCavalos.length} caminhões = <strong>{BRL(taxasDoMesTotal / trucksCavalos.length)}</strong> cada
                  </div>
                  <button
                    onClick={() => distribuirTaxas(reportMonth)}
                    style={{ background: "#1B2430", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                  >
                    Dividir entre os caminhões
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
              <Field label="Mês de referência">
                <input
                  type="month"
                  style={inputStyle}
                  value={reportMonth}
                  onChange={(e) => setReportMonth(e.target.value)}
                />
              </Field>
              <button
                onClick={exportReportCSV}
                style={{
                  marginTop: 20,
                  background: "#1F6F5C",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "9px 16px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Baixar CSV
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  marginTop: 20,
                  background: "#6B4423",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "9px 16px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Baixar PDF
              </button>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <button
                onClick={() => setReportView("resumo")}
                style={{
                  padding: "7px 14px",
                  borderRadius: 10,
                  border: reportView === "resumo" ? "2px solid #D9A419" : "2px solid #D7DBE0",
                  background: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Resumido
              </button>
              <button
                onClick={() => setReportView("detalhado")}
                style={{
                  padding: "7px 14px",
                  borderRadius: 10,
                  border: reportView === "detalhado" ? "2px solid #D9A419" : "2px solid #D7DBE0",
                  background: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Detalhado
              </button>
            </div>

            <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 10 }}>
              {reportView === "resumo"
                ? <>Líquido = receita das viagens − comissão − carregamento − abastecimento − gastos extras (considera a <strong>data da viagem</strong>).</>
                : <>Mostra cada viagem com seus lançamentos de comissão, carregamento, abastecimento e gastos extras, igual ao relatório de referência.</>}
            </div>

            {reportView === "resumo" ? (
              monthlyReport.rows.every((r) => r.viagens === 0) ? (
              <div style={{ padding: "30px 10px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 12 }}>
                Nenhuma viagem lançada nesse mês ainda.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#EEF0F2" }}>
                      {["Cavalo/Carreta", "Viagens", "Receita", "Comissão", "Carregamento", "Abastec.", "Gastos", "Desp. Veíc.", "Líquido"].map((h) => (
                        <th key={h} style={{ textAlign: "right", padding: "8px 10px", fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: 0.3 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyReport.rows.map((r) => (
                      <tr key={r.id} style={{ borderBottom: "1px solid #EEF0F2" }}>
                        <td style={{ padding: "8px 10px", textAlign: "left", fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>
                          {r.placa}{r.carretaVinculada && <span style={{ color: "#5A6472", fontWeight: 400 }}> / {r.carretaVinculada}</span>}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "right" }}>{r.viagens}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right" }}>{BRL(r.receita)}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", color: "#B0402E" }}>−{BRL(r.comissaoTotal)}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", color: "#B0402E" }}>−{BRL(r.carregamentoTotal)}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", color: "#B0402E" }}>−{BRL(r.abastecimentoTotal)}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", color: "#B0402E" }}>−{BRL(r.gastosTotal)}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", color: "#B0402E" }}>−{BRL(r.despesasVeiculoTotal)}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700, color: r.liquido >= 0 ? "#12503F" : "#B0402E" }}>
                          {BRL(r.liquido)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#F7F8F9" }}>
                      <td style={{ padding: "10px", fontWeight: 700 }}>TOTAL</td>
                      <td style={{ padding: "10px", textAlign: "right", fontWeight: 700 }}>{monthlyReport.totals.viagens}</td>
                      <td style={{ padding: "10px", textAlign: "right", fontWeight: 700 }}>{BRL(monthlyReport.totals.receita)}</td>
                      <td style={{ padding: "10px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>−{BRL(monthlyReport.totals.comissaoTotal)}</td>
                      <td style={{ padding: "10px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>−{BRL(monthlyReport.totals.carregamentoTotal)}</td>
                      <td style={{ padding: "10px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>−{BRL(monthlyReport.totals.abastecimentoTotal)}</td>
                      <td style={{ padding: "10px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>−{BRL(monthlyReport.totals.gastosTotal)}</td>
                      <td style={{ padding: "10px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>−{BRL(monthlyReport.totals.despesasVeiculoTotal)}</td>
                      <td style={{ padding: "10px", textAlign: "right", fontWeight: 700, color: monthlyReport.totals.liquido >= 0 ? "#12503F" : "#B0402E" }}>
                        {BRL(monthlyReport.totals.liquido)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              )
            ) : detailedReport.length === 0 ? (
              <div style={{ padding: "30px 10px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 12 }}>
                Nenhuma viagem lançada nesse mês ainda.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {detailedReport.map((g) => (
                  <div key={g.id}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
                      Veículo: <span style={{ fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums" }}>{g.placa}</span>
                    </div>
                    {g.tripRows.map((t) => (
                      <div key={t.id} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", background: "#EEF0F2", padding: "6px 10px", fontSize: 13, fontWeight: 700 }}>
                          <span>{fmtDate(t.data)} · {t.codigo}  {t.empresa}</span>
                          <span>{t.origem} → {t.destino}</span>
                          <span>{BRL(t.valorViagem)}</span>
                        </div>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                          <tbody>
                            {t.expenses.map((e, i) => (
                              <tr key={i} style={{ borderBottom: "1px solid #F2F3F4" }}>
                                <td style={{ padding: "5px 10px", width: 90 }}>{fmtDate(e.data)}</td>
                                <td style={{ padding: "5px 10px" }}>{e.tipo}</td>
                                <td style={{ padding: "5px 10px" }}>{e.descricao}</td>
                                <td style={{ padding: "5px 10px", color: "#5A6472" }}>{e.planoDeConta}</td>
                                <td style={{ padding: "5px 10px", textAlign: "right" }}>{BRL(e.valor)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={4} style={{ padding: "5px 10px", textAlign: "right", fontWeight: 700 }}>Total de Despesas:</td>
                              <td style={{ padding: "5px 10px", textAlign: "right", fontWeight: 700 }}>{BRL(t.totalDespesas)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ))}

                    {g.despesasVeiculoTruck.length > 0 && (
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 11, color: "#5A6472", fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Despesas do veículo</div>
                        {g.despesasVeiculoTruck.map((d) =>
                          editingDespesaId === d.id ? (
                            <div key={d.id} style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-end", background: "#F7F8F9", padding: 10, borderRadius: 12, marginBottom: 4 }}>
                              <Field label="Data">
                                <input type="date" style={inputStyle} value={despesaData} onChange={(e) => setDespesaData(e.target.value)} onBlur={(e) => setDespesaData(corrigirAnoDigitado(e.target.value))} />
                              </Field>
                              <Field label="Descrição">
                                <input style={inputStyle} value={despesaDescricao} onChange={(e) => setDespesaDescricao(e.target.value)} placeholder="ex: Seguro, Sem Parar, taxa" />
                              </Field>
                              <Field label="Valor (R$)">
                                <input type="number" style={{ ...inputStyle, width: 100 }} value={despesaValor} onChange={(e) => setDespesaValor(e.target.value)} />
                              </Field>
                              <Field label="Observação (opcional)">
                                <input style={{ ...inputStyle, width: 140 }} value={despesaObs} onChange={(e) => setDespesaObs(e.target.value)} />
                              </Field>
                              <button onClick={confirmAddDespesa} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, cursor: "pointer" }}>
                                Salvar
                              </button>
                              <button onClick={() => { setAddingDespesaFor(null); setEditingDespesaId(null); }} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}>
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FBEBE8", borderRadius: 12, padding: "6px 10px", fontSize: 12, marginBottom: 4 }}>
                              <span>{fmtDate(d.data)} — {d.descricao} {d.observacao && <span style={{ color: "#5A6472" }}>({d.observacao})</span>}</span>
                              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <strong style={{ color: "#B0402E" }}>−{BRL(Math.abs(Number(d.valor) || 0))}</strong>
                                <button onClick={() => startEditDespesa(d)} style={{ background: "none", border: "none", color: "#2451A6", cursor: "pointer", fontSize: 12 }}>editar</button>
                                <button onClick={() => deleteDespesaVeiculo(d.id)} style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 13 }}>×</button>
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    <div style={{ textAlign: "right", fontWeight: 700, fontSize: 13, borderTop: "2px solid #1B2430", paddingTop: 6 }}>
                      Total do Veículo: {BRL(g.totalVeiculo)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {relatorioRecebimentoOpen && (
        <div
          onClick={() => setRelatorioRecebimentoOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-relatorio" style={{ width: "min(760px, 94vw)", maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: 14, zIndex: 21, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", padding: 24 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 22 }}>
                Relatório de Recebimento
              </div>
              <button
                onClick={() => setRelatorioRecebimentoOpen(false)}
                style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            <div className="filtros-relatorio" style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap" }}>
              <Field label="De">
                <input type="date" style={inputStyle} value={recebimentoPeriodStart} onChange={(e) => setRecebimentoPeriodStart(e.target.value)} onBlur={(e) => setRecebimentoPeriodStart(corrigirAnoDigitado(e.target.value))} />
              </Field>
              <Field label="Até">
                <input type="date" style={inputStyle} value={recebimentoPeriodEnd} onChange={(e) => setRecebimentoPeriodEnd(e.target.value)} onBlur={(e) => setRecebimentoPeriodEnd(corrigirAnoDigitado(e.target.value))} />
              </Field>
              <Field label="Caminhão">
                <select style={inputStyle} value={recebimentoCaminhaoFiltro} onChange={(e) => setRecebimentoCaminhaoFiltro(e.target.value)}>
                  <option value="all">Todos</option>
                  {trucksCavalos.map((tr) => <option key={tr.id} value={tr.id}>{tr.placa}</option>)}
                </select>
              </Field>
              <button onClick={() => window.print()} style={{ background: "#6B4423", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Baixar PDF
              </button>
            </div>

            {relatorioRecebimento.items.length === 0 ? (
              <div style={{ padding: "30px 10px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 12 }}>
                Nenhum recebimento nesse período.
              </div>
            ) : (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #EEF0F2" }}>
                      <th style={{ textAlign: "left", padding: "6px 8px", color: "#5A6472" }}>Data da viagem</th>
                      <th style={{ textAlign: "left", padding: "6px 8px", color: "#5A6472" }}>Data recebido</th>
                      <th style={{ textAlign: "left", padding: "6px 8px", color: "#5A6472" }}>Caminhão</th>
                      <th style={{ textAlign: "left", padding: "6px 8px", color: "#5A6472" }}>Contrato</th>
                      <th style={{ textAlign: "left", padding: "6px 8px", color: "#5A6472" }}>Empresa</th>
                      <th style={{ textAlign: "left", padding: "6px 8px", color: "#5A6472" }}>Tipo</th>
                      <th style={{ textAlign: "right", padding: "6px 8px", color: "#5A6472" }}>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatorioRecebimento.items.map((r, i) => (
                      <tr key={`${r.trip.id}-${r.tipo}`} style={{ background: i % 2 === 0 ? "#fff" : "#F7F8F9" }}>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #EEF0F2", color: "#5A6472" }}>{fmtDate(r.trip.data)}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #EEF0F2" }}>{fmtDate(r.data)}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #EEF0F2", fontWeight: 600 }}>{truckLabel(r.trip.caminhaoId)}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #EEF0F2" }}>{r.trip.contrato || ""}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #EEF0F2" }}>{r.trip.empresa || ""}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #EEF0F2" }}>{r.tipo}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #EEF0F2", textAlign: "right", fontWeight: 700, color: "#12503F" }}>{BRL(r.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15, background: "#1B2430", color: "#fff", borderRadius: 12, padding: "10px 14px" }}>
                  <span>TOTAL RECEBIDO</span>
                  <span>{BRL(relatorioRecebimento.total)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {relatorioGastosOpen && (
        <div
          onClick={() => setRelatorioGastosOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-relatorio" style={{ width: "min(980px, 96vw)", maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: 14, zIndex: 21, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", padding: 24 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 22 }}>
                Gastos extras por caminhão
              </div>
              <button
                onClick={() => setRelatorioGastosOpen(false)}
                style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 14 }}>
              Pedágio pago na hora, comida, conserto de estrada, taxa de viagem (rateio) e outros gastos que nunca viram boleto — só pra acompanhar separado.
            </div>

            <button
              onClick={aplicarCategoriaPadraoGastosAntigos}
              style={{ background: "none", border: "1px dashed #D9A419", color: "#8A5A00", borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 14 }}
            >
              ⚡ Marcar gastos antigos sem categoria como "Despesas Estrada"
            </button>

            <div className="filtros-relatorio" style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap" }}>
              <Field label="Período">
                <PeriodoDropdown
                  periodStart={gastosPeriodStart}
                  periodEnd={gastosPeriodEnd}
                  onQuickPeriod={setGastosQuickPeriod}
                  onChangeStart={setGastosPeriodStart}
                  onChangeEnd={setGastosPeriodEnd}
                />
              </Field>
              <Field label="Setor">
                <select style={inputStyle} value={gastosSetorFiltro} onChange={(e) => setGastosSetorFiltro(e.target.value)}>
                  <option value="all">Todos</option>
                  {relatorioGastosExtras.setoresList.map((s) => (
                    <option key={s.setor} value={s.setor}>{s.setor}</option>
                  ))}
                </select>
              </Field>
              <button onClick={() => window.print()} style={{ background: "#6B4423", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Baixar PDF
              </button>
            </div>

            {gastosSetorFiltro === "all" && relatorioGastosExtras.setoresList.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#9AA5B1", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Total por setor (todos os caminhões juntos)</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {relatorioGastosExtras.setoresList.map((s) => (
                    <button
                      key={s.setor}
                      onClick={() => setGastosSetorFiltro(s.setor)}
                      className="linha-clicavel"
                      style={{ background: "#F7F8F9", border: "1px solid #E4E7EB", borderRadius: 10, padding: "8px 12px", cursor: "pointer", textAlign: "left" }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1B2430" }}>{s.setor}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#B0402E" }}>{BRL(s.total)}</div>
                      <div style={{ fontSize: 10, color: "#9AA5B1" }}>{s.quantidade} lançamento{s.quantidade !== 1 ? "s" : ""}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {relatorioGastosExtras.rows.length === 0 ? (
              <div style={{ padding: "30px 10px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 12 }}>
                Nenhum gasto extra lançado nesse período.
              </div>
            ) : (
              <>
                {relatorioGastosExtras.rows.map((r) => (
                  <div key={r.caminhaoId} style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r.placa}</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#B0402E" }}>{BRL(r.total)}</div>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed" }}>
                      <colgroup>
                        <col style={{ width: "13%" }} />
                        <col style={{ width: "29%" }} />
                        <col style={{ width: "19%" }} />
                        <col style={{ width: "19%" }} />
                        <col style={{ width: "20%" }} />
                      </colgroup>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #EEF0F2" }}>
                          <th style={{ textAlign: "left", padding: "5px 8px", color: "#5A6472" }}>Data</th>
                          <th style={{ textAlign: "left", padding: "5px 8px", color: "#5A6472" }}>Descrição</th>
                          <th style={{ textAlign: "left", padding: "5px 8px", color: "#5A6472" }}>Categoria</th>
                          <th style={{ textAlign: "left", padding: "5px 8px", color: "#5A6472" }}>Setor</th>
                          <th style={{ textAlign: "right", padding: "5px 8px", color: "#5A6472" }}>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {r.gastos.map((g, i) => (
                          <tr key={g.id} style={{ background: i % 2 === 0 ? "#fff" : "#F7F8F9" }}>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", color: "#5A6472", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fmtDate(g.data)}</td>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.descricao || ""}</td>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", color: "#5A6472", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.categoria || "—"}</td>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", color: "#5A6472", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.setor || "—"}</td>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", textAlign: "right", fontWeight: 700 }}>{BRL(Number(g.valor) || 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15, background: "#1B2430", color: "#fff", borderRadius: 12, padding: "10px 14px" }}>
                  <span>TOTAL GERAL</span>
                  <span>{BRL(relatorioGastosExtras.totalGeral)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {relatorioConsumoOpen && (
        <div
          onClick={() => setRelatorioConsumoOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-relatorio" style={{ width: "min(980px, 96vw)", maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: 14, zIndex: 21, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", padding: 24 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 22 }}>
                Consumo (km/L)
              </div>
              <button
                onClick={() => setRelatorioConsumoOpen(false)}
                style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 14 }}>
              Km rodado entre um abastecimento de diesel e o seguinte, dividido pela litragem abastecida — sempre na
              ordem da <strong>data do abastecimento</strong>, mesmo que o motorista mande o comprovante depois.
            </div>

            <div className="filtros-relatorio" style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap" }}>
              <Field label="Período">
                <PeriodoDropdown
                  periodStart={consumoPeriodStart}
                  periodEnd={consumoPeriodEnd}
                  onQuickPeriod={setConsumoQuickPeriod}
                  onChangeStart={setConsumoPeriodStart}
                  onChangeEnd={setConsumoPeriodEnd}
                />
              </Field>
              <Field label="Caminhão">
                <select style={inputStyle} value={consumoCaminhaoFiltro} onChange={(e) => setConsumoCaminhaoFiltro(e.target.value)}>
                  <option value="all">Todos</option>
                  {trucksCavalos.map((tr) => <option key={tr.id} value={tr.id}>{tr.placa}</option>)}
                </select>
              </Field>
              <button onClick={() => window.print()} style={{ background: "#6B4423", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Baixar PDF
              </button>
            </div>

            {consumoCaminhaoFiltro === "all" && relatorioConsumo.gruposPorPlaca.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#9AA5B1", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Média geral por caminhão nesse período</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {relatorioConsumo.gruposPorPlaca.map((g) => (
                    <button
                      key={g.placa}
                      onClick={() => setConsumoCaminhaoFiltro(g.itens[0].caminhaoId)}
                      className="linha-clicavel"
                      style={{ background: "#F7F8F9", border: "1px solid #E4E7EB", borderRadius: 10, padding: "8px 12px", cursor: "pointer", textAlign: "left" }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1B2430" }}>{g.placa}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1F6F5C" }}>{g.mediaGeral != null ? `${g.mediaGeral.toFixed(2)} km/L` : "—"}</div>
                      <div style={{ fontSize: 10, color: "#9AA5B1" }}>{g.itens.length} intervalo{g.itens.length !== 1 ? "s" : ""}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {relatorioConsumo.linhas.length === 0 ? (
              <div style={{ padding: "30px 10px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 12 }}>
                Nenhum intervalo entre abastecimentos de diesel nesse período (precisa de pelo menos 2 abastecimentos
                com km preenchido pro mesmo caminhão).
              </div>
            ) : (
              <>
                {relatorioConsumo.gruposPorPlaca.map((g) => (
                  <div key={g.placa} style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{g.placa}</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1F6F5C" }}>
                        {g.mediaGeral != null ? `média: ${g.mediaGeral.toFixed(2)} km/L` : ""}
                      </div>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed" }}>
                      <colgroup>
                        <col style={{ width: "12%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "16%" }} />
                        <col style={{ width: "16%" }} />
                        <col style={{ width: "16%" }} />
                      </colgroup>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #EEF0F2" }}>
                          <th style={{ textAlign: "left", padding: "5px 8px", color: "#5A6472" }}>Data</th>
                          <th style={{ textAlign: "left", padding: "5px 8px", color: "#5A6472" }}>Posto anterior</th>
                          <th style={{ textAlign: "left", padding: "5px 8px", color: "#5A6472" }}>Posto atual</th>
                          <th style={{ textAlign: "right", padding: "5px 8px", color: "#5A6472" }}>Km rodado</th>
                          <th style={{ textAlign: "right", padding: "5px 8px", color: "#5A6472" }}>Litros</th>
                          <th style={{ textAlign: "right", padding: "5px 8px", color: "#5A6472" }}>Km/L</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.itens.map((l, i) => {
                          const abrirViagemDoAbastecimento = (tripId) => {
                            const trip = trips.find((t) => t.id === tripId);
                            if (trip) { setRelatorioConsumoOpen(false); setReabrirConsumoAoFecharViagem(true); openEditTrip(trip); }
                          };
                          return (
                          <tr key={l.id} style={{ background: l.invalido ? "#FBEBE8" : i % 2 === 0 ? "#fff" : "#F7F8F9" }}>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", color: "#5A6472" }}>{fmtDate(l.data)}</td>
                            <td
                              onClick={() => l.tripIdAnterior && abrirViagemDoAbastecimento(l.tripIdAnterior)}
                              style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", color: l.tripIdAnterior ? "#2451A6" : "#5A6472", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: l.tripIdAnterior ? "pointer" : "default", textDecoration: l.tripIdAnterior ? "underline" : "none" }}
                            >
                              {l.postoAnterior || "—"}
                              <div style={{ fontSize: 10, color: "#9AA5B1" }}>{l.kmAnterior ? `${l.kmAnterior.toLocaleString("pt-BR")} km` : ""}</div>
                            </td>
                            <td
                              onClick={() => l.tripId && abrirViagemDoAbastecimento(l.tripId)}
                              style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: l.tripId ? "pointer" : "default" }}
                            >
                              <span style={{ color: l.tripId ? "#2451A6" : "#1B2430", textDecoration: l.tripId ? "underline" : "none" }}>{l.posto || "—"}</span>
                              <div style={{ fontSize: 10, color: "#9AA5B1" }}>{l.kmAtual ? `${l.kmAtual.toLocaleString("pt-BR")} km` : ""}</div>
                              {l.postosPulados.length > 0 && (
                                <div style={{ fontSize: 9, color: "#8A5A00", whiteSpace: "normal" }}>
                                  + litros de {l.postosPulados.length} sem km:{" "}
                                  {l.postosPulados.map((p, idx) => (
                                    <button
                                      key={p.id}
                                      onClick={(e) => { e.stopPropagation(); abrirViagemDoAbastecimento(p.tripId); }}
                                      style={{ background: "none", border: "none", padding: 0, color: "#2451A6", textDecoration: "underline", cursor: "pointer", fontSize: 9, fontFamily: "inherit" }}
                                    >
                                      {p.posto}{idx < l.postosPulados.length - 1 ? ", " : ""}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", textAlign: "right", color: l.invalido ? "#B0402E" : "#1B2430" }}>
                              {l.kmRodado} {l.invalido && "⚠️"}
                            </td>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", textAlign: "right" }}>{l.litros ? l.litros.toFixed(1) : "—"}</td>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", textAlign: "right", fontWeight: 700 }}>{l.consumo != null ? l.consumo.toFixed(2) : "—"}</td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {g.itens.some((l) => l.invalido) && (
                      <div style={{ fontSize: 11, color: "#B0402E", marginTop: 4 }}>
                        ⚠️ km rodado zerado ou negativo — confira a quilometragem lançada nesses abastecimentos.
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {relatorioServicosOpen && (
        <div
          onClick={() => setRelatorioServicosOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-relatorio"
            style={{ width: "min(900px, 96vw)", maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: 14, zIndex: 21, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", padding: 24 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 22 }}>
                Serviços por empresa
              </div>
              <button
                onClick={() => setRelatorioServicosOpen(false)}
                style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 14 }}>
              Serviços que aparecem em "Outros Serviços Importantes" (lançados direto ali, ou como gasto extra de viagem
              marcado como "importante") e que também têm uma empresa marcada — pra saber tudo que já foi feito numa
              empresa específica, tipo Força Diesel.
            </div>

            <div className="filtros-relatorio" style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap" }}>
              <Field label="Empresa">
                <select style={inputStyle} value={servicosEmpresaFiltro} onChange={(e) => setServicosEmpresaFiltro(e.target.value)}>
                  <option value="all">Todas</option>
                  {boletosEmpresas.map((nome) => <option key={nome} value={nome}>{nome}</option>)}
                </select>
              </Field>
              <Field label="Período">
                <PeriodoDropdown
                  periodStart={servicosPeriodStart}
                  periodEnd={servicosPeriodEnd}
                  onQuickPeriod={setServicosQuickPeriod}
                  onChangeStart={setServicosPeriodStart}
                  onChangeEnd={setServicosPeriodEnd}
                />
              </Field>
              <button onClick={() => window.print()} style={{ background: "#6B4423", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Baixar PDF
              </button>
            </div>

            {relatorioServicos.items.length === 0 ? (
              <div style={{ padding: "30px 10px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 12 }}>
                Nenhum serviço com empresa marcada nesse período{servicosEmpresaFiltro !== "all" ? ` para ${servicosEmpresaFiltro}` : ""}.
              </div>
            ) : (
              <>
                <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 8 }}>
                  {relatorioServicos.items.length} serviço{relatorioServicos.items.length !== 1 ? "s" : ""} · total {BRL(relatorioServicos.items.reduce((s, l) => s + l.valor, 0))}
                </div>
                <div style={{ background: "#fff", border: "1px solid #E4E7EB", borderRadius: 12, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#F7F8F9" }}>
                        <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Data</th>
                        <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Placa</th>
                        <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>KM</th>
                        <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Serviço</th>
                        {servicosEmpresaFiltro === "all" && <th style={{ textAlign: "left", padding: "8px 12px", color: "#5A6472" }}>Empresa</th>}
                        <th style={{ textAlign: "right", padding: "8px 12px", color: "#5A6472" }}>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatorioServicos.items.map((l, i) => (
                        <tr
                          key={l.id}
                          onClick={() => {
                            if (l.tripId) {
                              const trip = trips.find((t) => t.id === l.tripId);
                              if (trip) { setRelatorioServicosOpen(false); openEditTrip(trip); }
                            } else {
                              const servico = servicosVeiculo.find((s) => s.id === l.id);
                              if (servico) { setRelatorioServicosOpen(false); setView("trocaoleo"); startEditServico(servico); }
                            }
                          }}
                          style={{ background: i % 2 === 0 ? "#fff" : "#F7F8F9", cursor: "pointer" }}
                        >
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>{fmtDate(l.data)}</td>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", fontWeight: 700 }}>{l.placa}</td>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>{l.km ? `${Number(l.km).toLocaleString("pt-BR")} km` : "—"}</td>
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2" }}>{l.servico}</td>
                          {servicosEmpresaFiltro === "all" && <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", color: "#5A6472" }}>{l.empresa}</td>}
                          <td style={{ padding: "8px 12px", borderTop: "1px solid #EEF0F2", textAlign: "right", fontWeight: 700 }}>{BRL(l.valor)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {view === "abastecimentos" && (
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "24px 28px" }}>
          <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 12 }}>
            Confere com o relatório que o posto te manda antes de pagar — se um abastecimento não estiver aqui, é porque não foi lançado numa viagem ainda.
          </div>

          {abastecPlacaFilter !== "all" && perfilAbastecimentoCaminhao && (() => {
            const trSel = trucksCavalos.find((tr) => tr.id === abastecPlacaFilter);
            if (!trSel) return null;
            const kmAtualPlaca = kmAtualPorCaminhao[trSel.id] || 0;
            return (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center", background: "#fff", border: "1px solid #E4E7EB", borderRadius: 14, padding: 16, marginBottom: 14, flexWrap: "wrap" }}>
                  <div style={{ width: 72, height: 72, borderRadius: 14, overflow: "hidden", background: "#F7F8F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {trSel.foto ? <img src={trSel.foto} alt={trSel.placa} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <TruckIcon size={48} />}
                  </div>
                  <div style={{ flex: "1 1 160px" }}>
                    <div style={{ fontWeight: 700, fontSize: 22, fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums" }}>{trSel.placa}</div>
                    <div style={{ color: "#5A6472", fontSize: 13 }}>{trSel.modelo || "Modelo não cadastrado (ajuste em Configurações)"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#9AA5B1", textTransform: "uppercase" }}>KM atual</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#2451A6" }}>{kmAtualPlaca > 0 ? `${kmAtualPlaca.toLocaleString("pt-BR")} km` : "—"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#9AA5B1", textTransform: "uppercase" }}>Último abastecimento</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#2451A6" }}>{perfilAbastecimentoCaminhao.ultimoAbastecimento ? fmtDate(perfilAbastecimentoCaminhao.ultimoAbastecimento) : "—"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#9AA5B1", textTransform: "uppercase" }}>Consumo médio</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#2451A6" }}>{perfilAbastecimentoCaminhao.consumoMedio ? `${perfilAbastecimentoCaminhao.consumoMedio.toFixed(2)} km/l` : "—"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#9AA5B1", textTransform: "uppercase" }}>Gasto no mês</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#2451A6" }}>{BRL(perfilAbastecimentoCaminhao.gastoNoMes)}</div>
                    </div>
                  </div>
                </div>

                {perfilAbastecimentoCaminhao.chartPoints.length > 0 && (
                  <div style={{ background: "#fff", border: "1px solid #E4E7EB", borderRadius: 14, padding: 16, marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#5A6472", textTransform: "uppercase", marginBottom: 4 }}>Consumo (km/l)</div>
                    <div style={{ fontSize: 11, color: "#9AA5B1", marginBottom: 8 }}>Média dos últimos {perfilAbastecimentoCaminhao.chartPoints.length} abastecimentos</div>
                    <MiniLineChart
                      points={perfilAbastecimentoCaminhao.chartPoints.map((p) => ({ label: fmtDate(p.data).slice(0, 5), valor: p.consumo }))}
                    />
                  </div>
                )}

                <div style={{ background: "#fff", border: "1px solid #E4E7EB", borderRadius: 14, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Histórico de abastecimentos</div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #EEF0F2" }}>
                        {["Data", "KM", "Litros", "Valor (R$)", "Posto", "Valor / Litro"].map((h) => (
                          <th key={h} style={{ textAlign: h === "Valor (R$)" || h === "Valor / Litro" || h === "Litros" || h === "KM" ? "right" : "left", padding: "5px 8px", color: "#5A6472" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {perfilAbastecimentoCaminhao.historico.map((a) => (
                        <tr key={a.id} style={{ borderBottom: "1px solid #EEF0F2" }}>
                          <td style={{ padding: "5px 8px" }}>{fmtDate(a.data)}</td>
                          <td style={{ padding: "5px 8px", textAlign: "right" }}>{a.km ? Number(a.km).toLocaleString("pt-BR") : "—"}</td>
                          <td style={{ padding: "5px 8px", textAlign: "right" }}>{formatLitros(a.litragem)}</td>
                          <td style={{ padding: "5px 8px", textAlign: "right" }}>{BRL(a.valor)}</td>
                          <td style={{ padding: "5px 8px" }}>{a.posto}</td>
                          <td style={{ padding: "5px 8px", textAlign: "right" }}>{a.litragem > 0 ? BRL(a.valor / Number(a.litragem)) : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          <button
            onClick={abrirUnificarPostos}
            style={{ background: "none", border: "1px solid #B0402E", color: "#B0402E", borderRadius: 10, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 12 }}
          >
            Unificar postos com nome parecido
          </button>

          <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap", background: "#fff", border: "1px solid #E4E7EB", borderRadius: 12, padding: 14, marginBottom: 20 }}>
            <Field label="Placa">
              <select style={inputStyle} value={abastecPlacaFilter} onChange={(e) => setAbastecPlacaFilter(e.target.value)}>
                <option value="all">Todas</option>
                {trucksCavalos.map((tr) => <option key={tr.id} value={tr.id}>{tr.placa}{tr.modelo ? ` — ${tr.modelo}` : ""}</option>)}
              </select>
            </Field>
            <Field label="Período">
              <PeriodoDropdown
                periodStart={abastecPeriodStart}
                periodEnd={abastecPeriodEnd}
                onQuickPeriod={setAbastecQuickPeriod}
                onChangeStart={setAbastecPeriodStart}
                onChangeEnd={setAbastecPeriodEnd}
              />
            </Field>
            <Field label="Posto">
              <select style={inputStyle} value={abastecPostoFilter} onChange={(e) => setAbastecPostoFilter(e.target.value)}>
                <option value="all">Todos</option>
                {abastecPostosList.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <div style={{ flex: 1 }} />
            <button onClick={exportAbastecCSV} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Baixar CSV
            </button>
            <button onClick={() => window.print()} style={{ background: "#6B4423", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Baixar PDF
            </button>
          </div>

          {abastecReport.porPosto.length === 0 ? (
            <div style={{ background: "#fff", padding: "30px 10px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 12 }}>
              Nenhum abastecimento nesse período.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {abastecReport.porPosto.map((grupo) => (
                <div key={grupo.posto} style={{ background: "#fff", borderRadius: 12, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14, marginBottom: 6, borderBottom: "2px solid #EEF0F2", paddingBottom: 4 }}>
                    <span>{grupo.posto}</span>
                    <span>{BRL(grupo.valor)} {(grupo.litragemDiesel > 0 || grupo.litragemArla > 0) && <span style={{ fontWeight: 400, color: "#5A6472", fontSize: 12 }}>({grupo.litragemDiesel > 0 && `${formatLitros(grupo.litragemDiesel)}L diesel`}{grupo.litragemDiesel > 0 && grupo.litragemArla > 0 && " · "}{grupo.litragemArla > 0 && `${formatLitros(grupo.litragemArla)}L arla`})</span>}</span>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
                    <colgroup>
                      <col style={{ width: "13%" }} />
                      <col style={{ width: "15%" }} />
                      <col style={{ width: "20%" }} />
                      <col style={{ width: "14%" }} />
                      <col style={{ width: "14%" }} />
                      <col style={{ width: "12%" }} />
                      <col style={{ width: "12%" }} />
                    </colgroup>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #EEF0F2" }}>
                        {["Data", "Caminhão", "Origem", "Litragem", "R$/L", "Cupom", "Valor"].map((h, i) => (
                          <th key={h} style={{ padding: "5px 8px", textAlign: i === 6 ? "right" : "left", fontSize: 11, color: "#5A6472", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {grupo.items.map((a) => (
                        <tr key={a.id} style={{ borderBottom: "1px solid #EEF0F2" }}>
                          <td style={{ padding: "5px 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fmtDate(a.data)}</td>
                          <td style={{ padding: "5px 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{truckLabel(a.caminhaoId)}</td>
                          <td style={{ padding: "5px 8px", color: "#5A6472", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.origem}</td>
                          <td style={{ padding: "5px 8px", color: "#5A6472" }}>{a.litragem ? `${a.litragem} L` : "—"}</td>
                          <td style={{ padding: "5px 8px", color: "#5A6472" }}>{Number(a.litragem) > 0 ? `${BRL(a.valor / Number(a.litragem))}/L` : "—"}</td>
                          <td style={{ padding: "5px 8px", color: "#5A6472", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.numeroCupom || "—"}</td>
                          <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700 }}>{BRL(a.valor)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
              <div style={{ background: "#fff", borderRadius: 12, padding: 14, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15 }}>
                <span>TOTAL</span>
                <span>{BRL(abastecReport.totals.valor)} {(abastecReport.totals.litragemDiesel > 0 || abastecReport.totals.litragemArla > 0) && <span style={{ fontWeight: 400, color: "#5A6472", fontSize: 12 }}>({abastecReport.totals.litragemDiesel > 0 && `${formatLitros(abastecReport.totals.litragemDiesel)}L diesel`}{abastecReport.totals.litragemDiesel > 0 && abastecReport.totals.litragemArla > 0 && " · "}{abastecReport.totals.litragemArla > 0 && `${formatLitros(abastecReport.totals.litragemArla)}L arla`})</span>}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {view === "trocaoleo" && (
        <div style={{ padding: "24px 28px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 16 }}>
            Por padrão, a troca de óleo é feita a cada <strong>{CONFIG_INTERVALO_OLEO_KM.toLocaleString("pt-BR")} km</strong> (ajustável em Configurações). Se algum caminhão tiver um km diferente (marca diferente, por exemplo), dá pra ajustar só o dele no cartão. Lance aqui a última troca de cada caminhão — a partir daí o app avisa sozinho quando cada um se aproximar da próxima.
          </div>

          {/* status por caminhão */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 20 }}>
            {trucksCavalos.map((tr) => {
              const kmAtual = kmAtualPorCaminhao[tr.id] || 0;
              const ultima = ultimaTrocaPorCaminhao[tr.id];
              const kmDesde = ultima ? kmAtual - ultima.km : kmAtual;
              const intervaloDoCaminhao = intervaloOleoDoCaminhao(tr);
              const precisa = !tr.semAlertaOleo && kmAtual > 0 && kmDesde >= intervaloDoCaminhao;
              const faltam = intervaloDoCaminhao - kmDesde;
              const quaseNaHora = !tr.semAlertaOleo && kmAtual > 0 && !precisa && faltam <= 1000;
              const corAccent = precisa ? "#B0402E" : quaseNaHora ? "#D9A419" : "#1F6F5C";
              const progresso = intervaloDoCaminhao > 0 ? Math.max(0, Math.min(100, (kmDesde / intervaloDoCaminhao) * 100)) : 0;
              return (
                <div
                  key={tr.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #E4E7EB",
                    borderLeft: `4px solid ${tr.semAlertaOleo ? "#D7DBE0" : corAccent}`,
                    borderRadius: 14,
                    padding: "14px 16px",
                    minWidth: 220,
                    flex: "1 1 220px",
                    boxShadow: "0 1px 3px rgba(27,36,48,0.05)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: 700, fontSize: 15 }}>{tr.placa}</span>
                    {precisa && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#B0402E", background: "#FBEBE8", padding: "3px 8px", borderRadius: 20 }}>TROCAR ÓLEO</span>
                    )}
                    {quaseNaHora && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#8A5A00", background: "#FFF6E2", padding: "3px 8px", borderRadius: 20 }}>⚠️ ATENÇÃO</span>
                    )}
                    {!precisa && !quaseNaHora && !tr.semAlertaOleo && kmAtual > 0 && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#1F6F5C", background: "#E9F5F1", padding: "3px 8px", borderRadius: 20 }}>EM DIA</span>
                    )}
                  </div>
                  {tr.semAlertaOleo ? (
                    <div style={{ fontSize: 12, color: "#9AA5B1", fontStyle: "italic" }}>
                      Manutenção feita pela fábrica — sem alerta de km
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 2 }}>
                        {kmAtual > 0 ? `KM atual: ${kmAtual.toLocaleString("pt-BR")}` : "Sem km lançado ainda"}
                      </div>
                      <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 8 }}>
                        {ultima ? `Última troca: ${ultima.km.toLocaleString("pt-BR")} km (${fmtDate(ultima.data)})` : "Nenhuma troca lançada"}
                      </div>
                      {kmAtual > 0 && (
                        <>
                          <div style={{ height: 6, background: "#EEF0F2", borderRadius: 20, overflow: "hidden", marginBottom: 6 }}>
                            <div style={{ width: `${progresso}%`, height: "100%", background: corAccent, borderRadius: 20, transition: "width 0.2s" }} />
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: corAccent }}>
                            {precisa ? `${(kmAtual - (ultima ? ultima.km : 0) - intervaloDoCaminhao).toLocaleString("pt-BR")} km além do previsto` : `Faltam ${faltam.toLocaleString("pt-BR")} km`}
                          </div>
                        </>
                      )}
                    </>
                  )}
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
                    {!tr.semAlertaOleo && (
                      <button
                        onClick={() => startAddTrocaOleo(tr.id)}
                        style={{ fontSize: 11, background: "#2451A6", color: "#fff", border: "none", borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontWeight: 600 }}
                      >
                        + lançar troca
                      </button>
                    )}
                    <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9AA5B1", cursor: "pointer" }}>
                      <input type="checkbox" checked={!!tr.semAlertaOleo} onChange={() => toggleSemAlertaOleo(tr.id)} />
                      Manutenção pela fábrica
                    </label>
                  </div>
                  {!tr.semAlertaOleo && (
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9AA5B1" }}>
                      <span>Trocar a cada</span>
                      <input
                        type="number"
                        value={tr.intervaloOleoKm || ""}
                        onChange={(e) => setIntervaloOleoCaminhao(tr.id, e.target.value)}
                        placeholder={CONFIG_INTERVALO_OLEO_KM}
                        style={{ width: 66, fontSize: 11, padding: "3px 5px", borderRadius: 6, border: "1px solid #D7DBE0" }}
                      />
                      <span>km {!tr.intervaloOleoKm && "(padrão)"}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {addingTrocaOleo && (
            <div
              onClick={() => setAddingTrocaOleo(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ width: "min(560px, 94vw)", maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: 14, zIndex: 21, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", padding: 20 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 20 }}>{editingTrocaOleoId ? "Editar troca de óleo" : "Lançar troca de óleo"}</div>
                  <button onClick={() => setAddingTrocaOleo(false)} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}>×</button>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <Field label="Caminhão">
                    <select style={inputStyle} value={trocaOleoCaminhaoId} onChange={(e) => setTrocaOleoCaminhaoId(e.target.value)}>
                      {trucksCavalos.map((tr) => <option key={tr.id} value={tr.id}>{tr.placa}</option>)}
                    </select>
                  </Field>
                  <Field label="Data">
                    <input type="date" style={inputStyle} value={trocaOleoData} onChange={(e) => setTrocaOleoData(e.target.value)} onBlur={(e) => setTrocaOleoData(corrigirAnoDigitado(e.target.value))} />
                  </Field>
                  <Field label="KM da troca">
                    <input type="text" inputMode="numeric" style={inputStyle} value={trocaOleoKm} onChange={(e) => setTrocaOleoKm(onlyDigits(e.target.value))} />
                  </Field>
                  <Field label="Observação">
                    <input style={{ ...inputStyle, width: 180 }} value={trocaOleoObs} onChange={(e) => setTrocaOleoObs(e.target.value)} placeholder="ex: trocou correia também" />
                  </Field>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 10 }}>
                    <input type="checkbox" checked={trocaOleoFiltro} onChange={(e) => setTrocaOleoFiltro(e.target.checked)} />
                    Trocou o filtro
                  </label>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button onClick={confirmAddTrocaOleo} style={{ flex: 1, background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, cursor: "pointer" }}>
                    Salvar
                  </button>
                  <button onClick={() => setAddingTrocaOleo(false)} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 10, padding: "10px 16px", cursor: "pointer" }}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* relatorio por periodo */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 16 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
              Histórico de trocas
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              <button onClick={() => setOleoQuickPeriod("hoje")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 10, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Hoje</button>
              <button onClick={() => setOleoQuickPeriod("semana")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 10, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Esta semana</button>
              <button onClick={() => setOleoQuickPeriod("mes")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 10, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Este mês</button>
              <button onClick={() => setOleoQuickPeriod("tudo")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 10, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Tudo</button>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap" }}>
              <Field label="De">
                <input type="date" style={inputStyle} value={oleoPeriodStart} onChange={(e) => setOleoPeriodStart(e.target.value)} onBlur={(e) => setOleoPeriodStart(corrigirAnoDigitado(e.target.value))} />
              </Field>
              <Field label="Até">
                <input type="date" style={inputStyle} value={oleoPeriodEnd} onChange={(e) => setOleoPeriodEnd(e.target.value)} onBlur={(e) => setOleoPeriodEnd(corrigirAnoDigitado(e.target.value))} />
              </Field>
              <Field label="Placa">
                <select style={inputStyle} value={oleoPlacaFilter} onChange={(e) => setOleoPlacaFilter(e.target.value)}>
                  <option value="all">Todas</option>
                  {trucksCavalos.map((tr) => <option key={tr.id} value={tr.id}>{tr.placa}</option>)}
                </select>
              </Field>
              <button onClick={exportTrocaOleoCSV} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Baixar CSV
              </button>
              <button onClick={() => window.print()} style={{ background: "#6B4423", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Baixar PDF
              </button>
            </div>

            {trocaOleoReport.items.length === 0 ? (
              <div style={{ padding: "20px 0", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 12 }}>
                Nenhuma troca de óleo nesse período.
              </div>
            ) : (
              <>
                {Object.entries(
                  trocaOleoReport.items.reduce((acc, t) => {
                    const placa = truckLabel(t.caminhaoId);
                    (acc[placa] = acc[placa] || []).push(t);
                    return acc;
                  }, {})
                ).map(([placa, itens]) => (
                  <div key={placa} style={{ marginBottom: 18 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: "#1B2430" }}>
                      🚚 {placa} <span style={{ fontWeight: 400, color: "#5A6472", fontSize: 12 }}>({itens.length} troca{itens.length !== 1 ? "s" : ""})</span>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: "#EEF0F2" }}>
                          {["Data", "KM", "Filtro", "Observação", ""].map((h) => (
                            <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {itens.map((t) => (
                          <tr key={t.id} style={{ borderBottom: "1px solid #EEF0F2" }}>
                            <td style={{ padding: "8px 10px" }}>{fmtDate(t.data)}</td>
                            <td style={{ padding: "8px 10px" }}>{Number(t.km).toLocaleString("pt-BR")} km</td>
                            <td style={{ padding: "8px 10px" }}>{t.filtroTrocado ? "Sim" : "Não"}</td>
                            <td style={{ padding: "8px 10px", color: "#5A6472" }}>{t.observacao || "—"}</td>
                            <td style={{ padding: "8px 10px", textAlign: "right" }}>
                              <button onClick={() => startEditTrocaOleo(t)} style={{ background: "none", border: "none", color: "#2451A6", cursor: "pointer", fontSize: 13, marginRight: 10 }}>editar</button>
                              <button onClick={() => deleteTrocaOleo(t.id)} style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 14 }}>×</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* ---- outros servicos importantes (independente da troca de oleo) ---- */}
          <div style={{ background: "#EEF0FF", border: "1px solid #C7CFFA", borderRadius: 12, padding: 16, marginTop: 24 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 4, color: "#2E3A8C" }}>
              🔧 Outros serviços importantes
            </div>
            <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 12 }}>
              Pneu, freios, suspensão, correia, revisão... Fica separado da troca de óleo — o km aqui é só um registro histórico, não conta pra o alerta dos 25 mil km.
            </div>

            <div style={{ marginBottom: 12 }}>
              {addingServico && (
                <div
                  onClick={() => setAddingServico(false)}
                  style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: "min(560px, 94vw)", maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: 14, zIndex: 21, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", padding: 20 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 20 }}>{editingServicoId ? "Editar serviço" : "Registrar outro serviço"}</div>
                      <button onClick={() => setAddingServico(false)} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}>×</button>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
                      <Field label="Caminhão">
                        <select style={inputStyle} value={servicoCaminhaoId} onChange={(e) => setServicoCaminhaoId(e.target.value)}>
                          {trucksCavalos.map((tr) => <option key={tr.id} value={tr.id}>{tr.placa}</option>)}
                        </select>
                      </Field>
                      <Field label="Data">
                        <input type="date" style={inputStyle} value={servicoData} onChange={(e) => setServicoData(e.target.value)} onBlur={(e) => setServicoData(corrigirAnoDigitado(e.target.value))} />
                      </Field>
                      <Field label="KM (opcional)">
                        <input type="number" style={inputStyle} value={servicoKm} onChange={(e) => setServicoKm(e.target.value)} />
                      </Field>
                      <Field label="Descrição do serviço">
                        <input style={{ ...inputStyle, width: 220 }} value={servicoTipo} onChange={(e) => setServicoTipo(e.target.value)} placeholder="ex: Troca de pneu dianteiro, revisão de freios..." autoFocus />
                      </Field>
                      <Field label="Observação (opcional)">
                        <input style={{ ...inputStyle, width: 180 }} value={servicoObs} onChange={(e) => setServicoObs(e.target.value)} placeholder="detalhes extras" />
                      </Field>
                      <Field label={<>Empresa <span title="Preenche se o serviço foi feito numa empresa cadastrada (ex: Força Diesel)" style={{ cursor: "help", color: "#9AA5B1" }}>ⓘ</span></>}>
                        <select style={inputStyle} value={servicoEmpresa} onChange={(e) => { setServicoEmpresa(e.target.value); if (!e.target.value) setServicoGerarBoleto(false); }}>
                          <option value="">Feito na estrada</option>
                          {boletosEmpresas.map((nome) => <option key={nome} value={nome}>{nome}</option>)}
                        </select>
                      </Field>
                    </div>
                    {servicoEmpresa && (
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5A6472", marginTop: 10 }}>
                        <input
                          type="checkbox"
                          checked={servicoGerarBoleto}
                          onChange={(e) => setServicoGerarBoleto(e.target.checked)}
                        />
                        Gerar boleto pendente pra {servicoEmpresa}
                      </label>
                    )}
                    {servicoEmpresa && servicoGerarBoleto && (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end", marginTop: 10 }}>
                        <Field label="Valor do boleto (R$)">
                          <input type="number" style={inputStyle} value={servicoValorBoleto} onChange={(e) => setServicoValorBoleto(e.target.value)} />
                        </Field>
                        <Field label="Vencimento do boleto">
                          <input type="date" style={inputStyle} value={servicoVencimentoBoleto} onChange={(e) => setServicoVencimentoBoleto(e.target.value)} onBlur={(e) => setServicoVencimentoBoleto(corrigirAnoDigitado(e.target.value))} />
                        </Field>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                      <button onClick={confirmAddServico} style={{ flex: 1, background: "#2E3A8C", color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, cursor: "pointer" }}>
                        Salvar
                      </button>
                      <button onClick={() => setAddingServico(false)} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 10, padding: "10px 16px", cursor: "pointer" }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {!addingServico && (
                <button
                  onClick={() => startAddServico()}
                  style={{ border: "2px dashed #8A94D9", background: "transparent", borderRadius: 10, padding: "7px 14px", fontSize: 13, color: "#2E3A8C", cursor: "pointer" }}
                >
                  + registrar outro serviço
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              <button onClick={() => setServicoQuickPeriod("hoje")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 10, border: "1px solid #C7CFFA", background: "#fff", cursor: "pointer" }}>Hoje</button>
              <button onClick={() => setServicoQuickPeriod("semana")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 10, border: "1px solid #C7CFFA", background: "#fff", cursor: "pointer" }}>Esta semana</button>
              <button onClick={() => setServicoQuickPeriod("mes")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 10, border: "1px solid #C7CFFA", background: "#fff", cursor: "pointer" }}>Este mês</button>
              <button onClick={() => setServicoQuickPeriod("tudo")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 10, border: "1px solid #C7CFFA", background: "#fff", cursor: "pointer" }}>Tudo</button>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap" }}>
              <Field label="De">
                <input type="date" style={inputStyle} value={servicoPeriodStart} onChange={(e) => setServicoPeriodStart(e.target.value)} onBlur={(e) => setServicoPeriodStart(corrigirAnoDigitado(e.target.value))} />
              </Field>
              <Field label="Até">
                <input type="date" style={inputStyle} value={servicoPeriodEnd} onChange={(e) => setServicoPeriodEnd(e.target.value)} onBlur={(e) => setServicoPeriodEnd(corrigirAnoDigitado(e.target.value))} />
              </Field>
              <Field label="Placa">
                <select style={inputStyle} value={servicoPlacaFilter} onChange={(e) => setServicoPlacaFilter(e.target.value)}>
                  <option value="all">Todas</option>
                  {trucksCavalos.map((tr) => <option key={tr.id} value={tr.id}>{tr.placa}</option>)}
                </select>
              </Field>
              <button onClick={exportServicoVeiculoCSV} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Baixar CSV
              </button>
              <button onClick={() => window.print()} style={{ background: "#6B4423", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Baixar PDF
              </button>
            </div>

            {servicoVeiculoReport.items.length === 0 ? (
              <div style={{ padding: "20px 0", textAlign: "center", color: "#5A6472", border: "1px dashed #C7CFFA", borderRadius: 12, background: "#fff" }}>
                Nenhum serviço lançado nesse período.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, background: "#fff", borderRadius: 12 }}>
                <thead>
                  <tr style={{ background: "#E0E4FA" }}>
                    {["Placa", "Data", "KM", "Serviço", "Observação", ""].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {servicoVeiculoReport.items.map((s) => (
                    <tr key={s.id} style={{ borderBottom: "1px solid #EEF0F2" }}>
                      <td style={{ padding: "8px 10px", fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{truckLabel(s.caminhaoId)}</td>
                      <td style={{ padding: "8px 10px" }}>{fmtDate(s.data)}</td>
                      <td style={{ padding: "8px 10px" }}>{s.km ? `${Number(s.km).toLocaleString("pt-BR")} km` : "—"}</td>
                      <td style={{ padding: "8px 10px" }}>{s.tipoServico}</td>
                      <td style={{ padding: "8px 10px", color: "#5A6472" }}>{s.observacao || "—"}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right" }}>
                        {s.origem === "gasto" ? (
                          <button
                            onClick={() => {
                              const trip = trips.find((t) => t.id === s.tripId);
                              if (trip) openEditTrip(trip);
                            }}
                            style={{ background: "none", border: "none", color: "#2451A6", cursor: "pointer", fontSize: 12, textDecoration: "underline" }}
                          >
                            editar na viagem
                          </button>
                        ) : (
                          <>
                            <button onClick={() => startEditServico(s)} style={{ background: "none", border: "none", color: "#2451A6", cursor: "pointer", fontSize: 13, marginRight: 10 }}>editar</button>
                            <button onClick={() => deleteServicoVeiculo(s.id)} style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 14 }}>×</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {view === "semparar" && (
        <div style={{ padding: "24px 28px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 16 }}>
            Total de cada vencimento = <strong>Pedágio − Vale Pedágio − Crédito</strong>. Lance um por placa a cada vencimento (dia 10, 20, 30 ou quando vier a fatura).
          </div>

          {/* colar e somar creditos */}
          <div style={{ background: "#EEF0FF", border: "1px solid #C7CFFA", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 6, color: "#2E3A8C" }}>
              📋 Colar e somar créditos do extrato
            </div>
            <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 8 }}>
              Cola aqui as linhas do PDF/extrato de crédito (uma por linha) — o app junta tudo por placa automaticamente, sem precisar digitar um por um.
            </div>
            <textarea
              value={colarCreditos}
              onChange={(e) => setColarCreditos(e.target.value)}
              placeholder="cole aqui as linhas copiadas do extrato..."
              style={{ width: "100%", minHeight: 100, borderRadius: 10, border: "1px solid #C7CFFA", padding: 10, fontSize: 12, fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums", boxSizing: "border-box" }}
            />
            <button
              onClick={somarCreditosColados}
              style={{ marginTop: 8, background: "#2E3A8C", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              Somar por placa
            </button>

            {creditosSomados && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 6 }}>
                  {creditosSomados.linhasReconhecidas} de {creditosSomados.totalLinhas} linhas reconhecidas.
                </div>
                {creditosSomados.resultado.length === 0 ? (
                  <div style={{ fontSize: 12, color: "#5A6472" }}>Não consegui reconhecer placa/valor nas linhas coladas.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {creditosSomados.resultado.map((r) => {
                      const usado = !!creditosUsados[r.placa];
                      return (
                        <div key={r.placa} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: usado ? "#F2F3F4" : "#fff", borderRadius: 10, padding: "7px 12px", fontSize: 13, opacity: usado ? 0.6 : 1 }}>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: 700, textDecoration: usado ? "line-through" : "none" }}>{r.placa}</span>
                          <span style={{ fontWeight: 700 }}>{BRL(r.total)}</span>
                          {usado ? (
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#12503F", background: "#E9F5F1", borderRadius: 6, padding: "5px 10px" }}>
                              ✓ já usado
                            </span>
                          ) : (
                            <button
                              onClick={() => usarCreditoNoFormulario(r.placa, r.total)}
                              style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "5px 10px", fontSize: 12, cursor: "pointer" }}
                            >
                              usar esse valor
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap" }}>
            <Field label="Período">
              <PeriodoDropdown
                periodStart={semPararPeriodStart}
                periodEnd={semPararPeriodEnd}
                onQuickPeriod={setSemPararQuickPeriod}
                onChangeStart={setSemPararPeriodStart}
                onChangeEnd={setSemPararPeriodEnd}
              />
            </Field>
            <Field label="Placa">
              <select style={inputStyle} value={semPararPlacaFilter} onChange={(e) => setSemPararPlacaFilter(e.target.value)}>
                <option value="all">Todas</option>
                {trucks.map((tr) => <option key={tr.id} value={tr.id}>{tr.placa}</option>)}
              </select>
            </Field>
            <button onClick={exportSemPararCSV} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Baixar CSV
            </button>
            <button onClick={() => window.print()} style={{ background: "#6B4423", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Baixar PDF
            </button>
            <button onClick={startAddSemParar} style={{ background: "#2451A6", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              + Lançar vencimento
            </button>
            <button onClick={confirmarFinanceiroSemParar} style={{ background: "#1B2430", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              ✓ Confirmar e gerar financeiro
            </button>
          </div>

          {/* outras arrecadacoes (nao entram por placa, so no total geral) */}
          <div style={{ background: "#FFF6E2", border: "1px solid #D9A419", borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 6, color: "#8A5A00" }}>
              Adicionar outra arrecadação (não é por placa — vai aparecer dentro da remessa da mesma data, logo abaixo)
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-end" }}>
              <Field label="Data">
                <input type="date" style={inputStyle} value={outroSemPararData} onChange={(e) => setOutroSemPararData(e.target.value)} onBlur={(e) => setOutroSemPararData(corrigirAnoDigitado(e.target.value))} />
              </Field>
              <Field label="Valor (R$)">
                <input type="number" style={{ ...inputStyle, width: 100 }} value={outroSemPararValor} onChange={(e) => setOutroSemPararValor(e.target.value)} />
              </Field>
              <Field label="Observação">
                <input style={{ ...inputStyle, width: 160 }} value={outroSemPararObs} onChange={(e) => setOutroSemPararObs(e.target.value)} />
              </Field>
              <button
                onClick={() => {
                  if (!outroSemPararValor) return;
                  if (editingSemPararOutroId) {
                    updateSemPararOutro(editingSemPararOutroId, outroSemPararData, outroSemPararValor, outroSemPararObs.trim());
                    setEditingSemPararOutroId(null);
                  } else {
                    addSemPararOutro(outroSemPararData, outroSemPararValor, outroSemPararObs.trim());
                  }
                  setOutroSemPararValor("");
                  setOutroSemPararObs("");
                }}
                style={{ background: "#8A5A00", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
              >
                {editingSemPararOutroId ? "Salvar" : "Adicionar"}
              </button>
              {editingSemPararOutroId && (
                <button
                  onClick={() => {
                    setEditingSemPararOutroId(null);
                    setOutroSemPararValor("");
                    setOutroSemPararObs("");
                  }}
                  style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 10, padding: "8px 14px", fontSize: 12, cursor: "pointer" }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>

          {semPararReport.porData.length === 0 ? (
            <div style={{ background: "#fff", padding: "30px 10px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 12 }}>
              Nenhum lançamento nesse período.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {semPararReport.porData.map((remessa) => (
                <div key={remessa.dataVencimento} style={{ border: "1px solid #D7DBE0", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: remessa.temNaoConfirmado ? "#FFF6E2" : "#E9F5F1", padding: "8px 14px" }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>
                      Vencimento {fmtDate(remessa.dataVencimento)}
                      {remessa.temNaoConfirmado ? (
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#8A5A00", background: "#fff", borderRadius: 6, padding: "2px 6px", marginLeft: 8 }}>pendente de confirmar</span>
                      ) : (
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#12503F", background: "#fff", borderRadius: 6, padding: "2px 6px", marginLeft: 8 }}>confirmado</span>
                      )}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{BRL(remessa.totalRemessa)}</span>
                  </div>
                  <div style={{ background: "#fff", padding: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {remessa.porPlaca.map((p) => (
                        <div key={p.caminhaoId}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 13, marginBottom: 4, borderBottom: "1px solid #EEF0F2", paddingBottom: 4 }}>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums" }}>{truckLabel(p.caminhaoId)}</span>
                            <span>{BRL(p.total)}</span>
                          </div>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                            <tbody>
                              {p.items.map((s) => (
                                <tr key={s.id} style={{ borderBottom: "1px solid #EEF0F2" }}>
                                  <td style={{ padding: "5px 8px", width: 80 }}>{fmtDate(s.dataVencimento)}</td>
                                  <td style={{ padding: "5px 8px", color: "#5A6472" }}>Pedágio {BRL(Number(s.valorPedagio) || 0)}</td>
                                  <td style={{ padding: "5px 8px", color: "#5A6472" }}>{Number(s.credito) > 0 ? `Crédito −${BRL(Number(s.credito))}` : ""}</td>
                                  <td style={{ padding: "5px 8px", fontWeight: 700, textAlign: "right" }}>{BRL(s.total)}</td>
                                  <td style={{ padding: "5px 8px", textAlign: "right" }}>
                                    {!s.confirmado && (
                                      <button
                                        onClick={() => marcarSemPararConfirmado(s.id)}
                                        title="Marcar como já confirmado sem gerar boleto novo (use se já tiver sido pago/lançado antes)"
                                        style={{ background: "none", border: "none", color: "#8A5A00", cursor: "pointer", fontSize: 11, marginRight: 8 }}
                                      >
                                        já confirmado?
                                      </button>
                                    )}
                                    <button onClick={() => startEditSemParar(s)} style={{ background: "none", border: "none", color: "#2451A6", cursor: "pointer", fontSize: 13, marginRight: 8 }}>editar</button>
                                    <button onClick={() => deleteSemParar(s.id)} style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 14 }}>×</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                      {remessa.outros.length > 0 && (
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: "#8A5A00" }}>Outras arrecadações (não é por placa)</div>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                            <tbody>
                              {remessa.outros.map((o) => (
                                <tr key={o.id} style={{ borderBottom: "1px solid #EEF0F2" }}>
                                  <td style={{ padding: "5px 8px" }}>{fmtDate(o.data)} {o.observacao && `— ${o.observacao}`}</td>
                                  <td style={{ padding: "5px 8px", fontWeight: 700, textAlign: "right" }}>{BRL(Number(o.valor) || 0)}</td>
                                  <td style={{ padding: "5px 8px", textAlign: "right", width: 140 }}>
                                    {!o.confirmado && (
                                      <button
                                        onClick={() => marcarSemPararOutroConfirmado(o.id)}
                                        title="Marcar como já confirmado sem gerar boleto novo (use se ela já tiver sido paga/lançada antes)"
                                        style={{ background: "none", border: "none", color: "#8A5A00", cursor: "pointer", fontSize: 11, marginRight: 8 }}
                                      >
                                        já confirmado?
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        setEditingSemPararOutroId(o.id);
                                        setOutroSemPararData(o.data);
                                        setOutroSemPararValor(o.valor);
                                        setOutroSemPararObs(o.observacao || "");
                                      }}
                                      style={{ background: "none", border: "none", color: "#2451A6", cursor: "pointer", fontSize: 12, marginRight: 8 }}
                                    >
                                      editar
                                    </button>
                                    <button onClick={() => deleteSemPararOutro(o.id)} style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 13 }}>×</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ background: "#1B2430", color: "#fff", borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16 }}>
                  <span>TOTAL GERAL (todas as remessas do período)</span>
                  <span>{BRL(semPararReport.totals.total)}</span>
                </div>
              </div>
            </div>
          )}

          {addingSemParar && (
            <div
              onClick={() => setAddingSemParar(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ width: "min(560px, 94vw)", maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: 14, zIndex: 21, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", padding: 20 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 20 }}>{editingSemPararId ? "Editar lançamento Sem Parar" : "Lançar vencimento Sem Parar"}</div>
                  <button onClick={() => setAddingSemParar(false)} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}>×</button>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <Field label="Placa">
                    {semPararCaminhaoCustom ? (
                      <input style={inputStyle} value={semPararCaminhaoId} onChange={(e) => setSemPararCaminhaoId(e.target.value)} placeholder="digite a placa" autoFocus />
                    ) : (
                      <select
                        style={inputStyle}
                        value={semPararCaminhaoId}
                        onChange={(e) => {
                          if (e.target.value === "__nova__") {
                            setSemPararCaminhaoCustom(true);
                            setSemPararCaminhaoId("");
                          } else {
                            setSemPararCaminhaoId(e.target.value);
                          }
                        }}
                      >
                        {trucks.map((tr) => <option key={tr.id} value={tr.id}>{tr.placa}</option>)}
                        <option value="__nova__">+ nova placa...</option>
                      </select>
                    )}
                  </Field>
                  <Field label="Data de vencimento">
                    <input type="date" style={inputStyle} value={semPararData} onChange={(e) => setSemPararData(e.target.value)} onBlur={(e) => setSemPararData(corrigirAnoDigitado(e.target.value))} />
                  </Field>
                  <Field label="Valor do pedágio (R$)">
                    <input type="number" style={inputStyle} value={semPararValorPedagio} onChange={(e) => setSemPararValorPedagio(e.target.value)} />
                  </Field>
                  <Field label="Crédito (R$)">
                    <input type="number" style={inputStyle} value={semPararCredito} onChange={(e) => setSemPararCredito(e.target.value)} />
                  </Field>
                  <Field label="Observação">
                    <input style={{ ...inputStyle, width: 180 }} value={semPararObs} onChange={(e) => setSemPararObs(e.target.value)} />
                  </Field>
                </div>
                <div style={{ fontSize: 13, color: "#5A6472", marginTop: 8 }}>
                  Total: <strong>{BRL((Number(semPararValorPedagio) || 0) - (Number(semPararCredito) || 0))}</strong>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <button onClick={confirmAddSemParar} style={{ flex: 1, background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, cursor: "pointer" }}>
                    Salvar
                  </button>
                  <button onClick={() => setAddingSemParar(false)} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 10, padding: "10px 16px", cursor: "pointer" }}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {unificarPostosOpen && (
        <div
          onClick={() => setUnificarPostosOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(480px, 94vw)", maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", padding: 22 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 20 }}>Unificar postos</div>
              <button onClick={() => setUnificarPostosOpen(false)} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}>×</button>
            </div>
            <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 12 }}>
              Marque as grafias que são o mesmo posto (ex: "Portal Itapuã" e "Portal de Itapuã"), depois escolha o nome que vai ficar valendo.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 260, overflowY: "auto", marginBottom: 14, border: "1px solid #EEF0F2", borderRadius: 12, padding: 8 }}>
              {postosList.length === 0 ? (
                <div style={{ fontSize: 13, color: "#5A6472", padding: 8 }}>Nenhum posto lançado ainda.</div>
              ) : (
                postosList.map((nome) => (
                  <label key={nome} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", padding: "5px 6px", borderRadius: 6 }}>
                    <input type="checkbox" checked={postosSelecionados.includes(nome)} onChange={() => togglePostoSelecionado(nome)} />
                    {nome}
                  </label>
                ))
              )}
            </div>
            {postosSelecionados.length > 0 && (
              <Field label="Nome que vai ficar valendo">
                <input style={inputStyle} value={postoCanonico} onChange={(e) => setPostoCanonico(e.target.value)} />
              </Field>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={confirmUnificarPostos} style={{ flex: 1, background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, cursor: "pointer" }}>
                Unificar
              </button>
              <button onClick={() => setUnificarPostosOpen(false)} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 10, padding: "10px 16px", cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "seguro" && (
        <div style={{ padding: "24px 28px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 16 }}>
            Cada seguradora vence num dia diferente — ajustável em Configurações. Hoje: {CONFIG_REGRAS_VENCIMENTO_SEGURO.map((r) => `${r.seguradora} dia ${r.dia}${r.antecipaFimDeSemana ? " (antecipa se cair em fim de semana)" : ""}`).join(" · ")}. Seguradoras não configuradas usam dia 15, com antecipação.
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap" }}>
            <Field label="Mês">
              <input type="month" style={inputStyle} value={seguroMesFiltro} onChange={(e) => setSeguroMesFiltro(e.target.value)} />
            </Field>
            <button onClick={exportSeguroCSV} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Baixar CSV
            </button>
            <button onClick={() => window.print()} style={{ background: "#6B4423", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Baixar PDF
            </button>
            <button onClick={startAddSeguro} style={{ background: "#2451A6", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              + Lançar seguro
            </button>
            <button onClick={confirmarFinanceiroSeguro} style={{ background: "#1B2430", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              ✓ Confirmar e gerar financeiro
            </button>
          </div>

          {seguroReport.items.length === 0 ? (
            <div style={{ background: "#fff", padding: "30px 10px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 12 }}>
              Nenhum lançamento de seguro nesse mês.
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 12, padding: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#EEF0F2" }}>
                    {["Cavalo", "Carreta", "Seguradora", "Total", "Observação", ""].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {seguroReport.items.map((s) => {
                    const total = (Number(s.cavaloValor) || 0) + (Number(s.carretaValor) || 0);
                    return (
                      <tr key={s.id} style={{ borderBottom: "1px solid #EEF0F2" }}>
                        <td style={{ padding: "8px 10px", fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums" }}>{truckLabel(s.cavaloCaminhaoId)} <span style={{ color: "#5A6472", fontFamily: "'Inter', sans-serif" }}>({BRL(Number(s.cavaloValor) || 0)})</span></td>
                        <td style={{ padding: "8px 10px", fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums" }}>{s.carretaCaminhaoId ? <>{truckLabel(s.carretaCaminhaoId)} <span style={{ color: "#5A6472", fontFamily: "'Inter', sans-serif" }}>({BRL(Number(s.carretaValor) || 0)})</span></> : "—"}</td>
                        <td style={{ padding: "8px 10px", color: "#2E3A8C", fontWeight: 600 }}>
                          {!s.carretaCaminhaoId || s.seguradoraCavalo === s.seguradoraCarreta
                            ? (s.seguradoraCavalo || "—")
                            : <span style={{ fontSize: 12 }}>cavalo: {s.seguradoraCavalo || "—"}<br />carreta: {s.seguradoraCarreta || "—"}</span>}
                        </td>
                        <td style={{ padding: "8px 10px", fontWeight: 700 }}>{BRL(total)}</td>
                        <td style={{ padding: "8px 10px", color: "#5A6472" }}>{s.observacao || "—"}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right" }}>
                          {s.confirmado && <span style={{ fontSize: 10, fontWeight: 700, color: "#12503F", background: "#E9F5F1", borderRadius: 6, padding: "2px 6px", marginRight: 6 }}>confirmado</span>}
                          {!s.confirmado && (
                            <button onClick={() => startEditSeguro(s)} style={{ background: "none", border: "none", color: "#2451A6", cursor: "pointer", fontSize: 13, marginRight: 8 }}>editar</button>
                          )}
                          <button onClick={() => deleteSeguro(s.id)} style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 14 }}>×</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#F7F8F9" }}>
                    <td colSpan={3} style={{ padding: "10px", fontWeight: 700 }}>TOTAL</td>
                    <td style={{ padding: "10px", fontWeight: 700 }}>{BRL(seguroReport.total)}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
              {Object.keys(seguroReport.porSeguradora).length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                  {Object.entries(seguroReport.porSeguradora).map(([nome, valor]) => (
                    <div key={nome} style={{ background: "#EEF0FF", border: "1px solid #C7CFFA", borderRadius: 12, padding: "8px 14px", fontSize: 13 }}>
                      <span style={{ color: "#2E3A8C", fontWeight: 700 }}>{nome}</span>: <strong>{BRL(valor)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {addingSeguro && (
            <div
              onClick={() => { setAddingSeguro(false); setEditingSeguroId(null); }}
              style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ width: "min(520px, 94vw)", maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: 14, zIndex: 21, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", padding: 20 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 20 }}>{editingSeguroId ? "Editar seguro" : "Lançar seguro"} — {seguroMesFiltro}</div>
                  <button onClick={() => { setAddingSeguro(false); setEditingSeguroId(null); }} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}>×</button>
                </div>

                <div style={{ fontSize: 12, fontWeight: 700, color: "#5A6472", textTransform: "uppercase", marginBottom: 6 }}>Cavalo</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 14 }}>
                  <Field label="Placa do cavalo">
                    <select
                      style={inputStyle}
                      value={seguroCavaloId}
                      onChange={(e) => {
                        setSeguroCavaloId(e.target.value);
                        const cavaloEscolhido = trucks.find((tr) => tr.id === e.target.value);
                        if (cavaloEscolhido && cavaloEscolhido.carretaVinculadaId) {
                          setSeguroCarretaId(cavaloEscolhido.carretaVinculadaId);
                        }
                      }}
                    >
                      {trucksCavalos.map((tr) => <option key={tr.id} value={tr.id}>{tr.placa}</option>)}
                    </select>
                  </Field>
                  <Field label="Valor do cavalo (R$)">
                    <input type="number" style={inputStyle} value={seguroCavaloValor} onChange={(e) => setSeguroCavaloValor(e.target.value)} />
                  </Field>
                  <Field label="Seguradora do cavalo">
                    {seguroSeguradoraCavaloCustom ? (
                      <input style={inputStyle} value={seguroSeguradoraCavalo} onChange={(e) => setSeguroSeguradoraCavalo(e.target.value)} placeholder="nome da seguradora" autoFocus />
                    ) : (
                      <select
                        style={inputStyle}
                        value={["ATCMG", "TRANSPOSEG"].includes(seguroSeguradoraCavalo) ? seguroSeguradoraCavalo : "__outra__"}
                        onChange={(e) => {
                          if (e.target.value === "__outra__") {
                            setSeguroSeguradoraCavaloCustom(true);
                            setSeguroSeguradoraCavalo("");
                          } else {
                            setSeguroSeguradoraCavalo(e.target.value);
                          }
                        }}
                      >
                        <option value="ATCMG">ATCMG</option>
                        <option value="TRANSPOSEG">TRANSPOSEG</option>
                        <option value="__outra__">outra...</option>
                      </select>
                    )}
                  </Field>
                </div>

                <div style={{ fontSize: 12, fontWeight: 700, color: "#5A6472", textTransform: "uppercase", marginBottom: 6 }}>Carreta (opcional)</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 14 }}>
                  <Field label="Placa da carreta">
                    {seguroCarretaCustom ? (
                      <input style={inputStyle} value={seguroCarretaId} onChange={(e) => setSeguroCarretaId(e.target.value)} placeholder="digite a placa" autoFocus />
                    ) : (
                      <select
                        style={inputStyle}
                        value={seguroCarretaId}
                        onChange={(e) => {
                          if (e.target.value === "__nova__") {
                            setSeguroCarretaCustom(true);
                            setSeguroCarretaId("");
                          } else {
                            setSeguroCarretaId(e.target.value);
                          }
                        }}
                      >
                        <option value="">— nenhuma —</option>
                        {trucksCarretas.map((tr) => <option key={tr.id} value={tr.id}>{tr.placa}</option>)}
                        <option value="__nova__">+ nova placa...</option>
                      </select>
                    )}
                  </Field>
                  <div style={{ flex: "0 0 110px" }}>
                    <Field label="Valor da carreta (R$)">
                      <input type="number" style={inputStyle} value={seguroCarretaValor} onChange={(e) => setSeguroCarretaValor(e.target.value)} />
                    </Field>
                  </div>
                  {!!seguroCarretaId && (
                    <Field label="Seguradora da carreta">
                      {seguroSeguradoraCarretaCustom ? (
                        <input style={inputStyle} value={seguroSeguradoraCarreta} onChange={(e) => setSeguroSeguradoraCarreta(e.target.value)} placeholder="nome da seguradora" autoFocus />
                      ) : (
                        <select
                          style={inputStyle}
                          value={["ATCMG", "TRANSPOSEG"].includes(seguroSeguradoraCarreta) ? seguroSeguradoraCarreta : "__outra__"}
                          onChange={(e) => {
                            if (e.target.value === "__outra__") {
                              setSeguroSeguradoraCarretaCustom(true);
                              setSeguroSeguradoraCarreta("");
                            } else {
                              setSeguroSeguradoraCarreta(e.target.value);
                            }
                          }}
                        >
                          <option value="ATCMG">ATCMG</option>
                          <option value="TRANSPOSEG">TRANSPOSEG</option>
                          <option value="__outra__">outra...</option>
                        </select>
                      )}
                    </Field>
                  )}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <Field label="Observação">
                    <input style={inputStyle} value={seguroObs} onChange={(e) => setSeguroObs(e.target.value)} />
                  </Field>
                </div>

                <div style={{ fontSize: 13, color: "#5A6472", marginTop: 10 }}>
                  Total: <strong>{BRL((Number(seguroCavaloValor) || 0) + (Number(seguroCarretaValor) || 0))}</strong>
                  {!!seguroCarretaId && seguroSeguradoraCavalo.trim().toUpperCase() !== seguroSeguradoraCarreta.trim().toUpperCase() && (
                    <span style={{ display: "block", color: "#8A5A00", marginTop: 4 }}>
                      ⚠️ Cavalo e carreta com seguradoras diferentes — vão gerar boletos separados, um pra cada.
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <button onClick={confirmAddSeguro} style={{ flex: 1, background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, cursor: "pointer" }}>
                    Salvar
                  </button>
                  <button onClick={() => { setAddingSeguro(false); setEditingSeguroId(null); }} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 10, padding: "10px 16px", cursor: "pointer" }}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {configOpen && (
        <div
          onClick={() => setConfigOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(560px, 94vw)", maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", padding: 22 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 22 }}>⚙️ Configurações</div>
              <button onClick={() => setConfigOpen(false)} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}>×</button>
            </div>

            {/* seção: geral (comissão e óleo) */}
            <button
              onClick={() => setConfigSecaoAberta(configSecaoAberta === "geral" ? null : "geral")}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F7F8F9", border: "none", borderRadius: 10, padding: "10px 14px", marginBottom: configSecaoAberta === "geral" ? 12 : 8, cursor: "pointer" }}
            >
              <span style={{ fontWeight: 700, fontSize: 13 }}>📊 Geral (comissão e óleo)</span>
              <span style={{ fontSize: 11, color: "#9AA5B1", transform: configSecaoAberta === "geral" ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▾</span>
            </button>
            {configSecaoAberta === "geral" && (
              <div style={{ padding: "0 4px", marginBottom: 8 }}>
                <Field label="Porcentagem da comissão do motorista (%)">
                  <input type="number" style={{ ...inputStyle, marginBottom: 4 }} value={configPercentualEdit} onChange={(e) => setConfigPercentualEdit(e.target.value)} />
                </Field>
                <div style={{ fontSize: 11, color: "#5A6472", marginBottom: 16 }}>
                  Vale pra todas as viagens novas. Viagens com "comissão com valor fixo" não são afetadas.
                </div>

                <Field label="Km padrão pra troca de óleo">
                  <input type="number" style={{ ...inputStyle, marginBottom: 4 }} value={configIntervaloOleoEdit} onChange={(e) => setConfigIntervaloOleoEdit(e.target.value)} />
                </Field>
                <div style={{ fontSize: 11, color: "#5A6472" }}>
                  Vale pra todos os caminhões, exceto os que tiverem um km próprio ajustado no cartão deles (aba Troca de Óleo).
                </div>

                <div style={{ height: 1, background: "#EEF0F2", margin: "18px 0 14px" }} />
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>🔒 Senha extra do sistema</div>
                <div style={{ fontSize: 11, color: "#9AA5B1", marginBottom: 10 }}>
                  Além do login do Google, pede essa senha toda vez que o app abre — útil se o computador/iPad já fica logado sozinho no Google.
                </div>
                {senhaAppSalva ? (
                  <div style={{ background: "#E9F5F1", borderRadius: 10, padding: 10, fontSize: 12, color: "#12503F", marginBottom: 8 }}>
                    ✅ Senha ativada.
                  </div>
                ) : (
                  <div style={{ background: "#F7F8F9", borderRadius: 10, padding: 10, fontSize: 12, color: "#5A6472", marginBottom: 8 }}>
                    Nenhuma senha extra ativada ainda.
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input
                    type="text"
                    value={configSenhaAppNovaEdit}
                    onChange={(e) => setConfigSenhaAppNovaEdit(e.target.value)}
                    placeholder={senhaAppSalva ? "nova senha" : "criar uma senha"}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    onClick={() => {
                      if (!configSenhaAppNovaEdit.trim()) return;
                      salvarSenhaApp(configSenhaAppNovaEdit.trim());
                      setConfigSenhaAppNovaEdit("");
                      alert("Senha salva!");
                    }}
                    style={{ background: "#2451A6", color: "#fff", border: "none", borderRadius: 10, padding: "0 14px", fontWeight: 700, cursor: "pointer" }}
                  >
                    {senhaAppSalva ? "Trocar" : "Ativar"}
                  </button>
                  {senhaAppSalva && (
                    <button
                      onClick={() => {
                        if (!window.confirm("Remover a senha extra? O app vai abrir direto, só com o login do Google, igual antes.")) return;
                        salvarSenhaApp("");
                      }}
                      style={{ background: "none", border: "1px solid #B0402E", color: "#B0402E", borderRadius: 10, padding: "0 14px", cursor: "pointer" }}
                    >
                      Remover
                    </button>
                  )}
                </div>

                <div style={{ height: 1, background: "#EEF0F2", margin: "18px 0 14px" }} />
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>🧾 Alerta de boleto vencido</div>
                <div style={{ fontSize: 11, color: "#9AA5B1", marginBottom: 10 }}>
                  Por padrão, avisa de boletos vencidos de todas as empresas. Desmarca as que você não quer receber alerta (ex: uma que você paga direto, sem passar pelo sistema).
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 220, overflowY: "auto" }}>
                  {empresas.slice().sort((a, b) => a.nome.localeCompare(b.nome)).map((e) => {
                    const incluida = !empresasExcluidasAlertaVencido.includes(e.nome);
                    return (
                      <label key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "4px 0", cursor: "pointer" }}>
                        <input type="checkbox" checked={incluida} onChange={() => alternarEmpresaAlertaVencido(e.nome)} />
                        {e.nome}
                      </label>
                    );
                  })}
                </div>

                <div style={{ height: 1, background: "#EEF0F2", margin: "18px 0 14px" }} />
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>🌐 Categorias de boleto no Dashboard Geral</div>
                <div style={{ fontSize: 11, color: "#9AA5B1", marginBottom: 10 }}>
                  Marca quais categorias de empresa (as mesmas de "gerenciar empresas" em Boletos) devem entrar como despesa no cálculo do Dashboard Geral — ex: juros, financiamentos, despesas de caminhão, seguros. Categorias não marcadas (tipo Funcionários, Administrativo) ficam de fora.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {categoriasEmpresaLista.map((c) => {
                    const incluida = categoriasIncluidasDashboardGeral.includes(c);
                    return (
                      <label key={c} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "4px 0", cursor: "pointer" }}>
                        <input type="checkbox" checked={incluida} onChange={() => alternarCategoriaDashboardGeral(c)} />
                        {c}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* seção: preços combinados por posto */}
            <button
              onClick={() => setConfigSecaoAberta(configSecaoAberta === "precosPostos" ? null : "precosPostos")}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F7F8F9", border: "none", borderRadius: 10, padding: "10px 14px", marginBottom: configSecaoAberta === "precosPostos" ? 12 : 8, cursor: "pointer" }}
            >
              <span style={{ fontWeight: 700, fontSize: 13 }}>⛽ Preços combinados por posto</span>
              <span style={{ fontSize: 11, color: "#9AA5B1", transform: configSecaoAberta === "precosPostos" ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▾</span>
            </button>
            {configSecaoAberta === "precosPostos" && (
              <div style={{ padding: "0 4px", marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: "#5A6472", marginBottom: 10 }}>
                  Cadastra o preço por litro combinado com cada posto (diesel e/ou arla). Ao lançar um
                  abastecimento, se o preço por litro calculado (valor ÷ litragem) ficar diferente do
                  combinado, aparece um aviso na hora — pra pegar cobrança errada antes de fechar o mês.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                  {precosPostos.map((p) => (
                    <div key={p.id} style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", background: "#F7F8F9", borderRadius: 10, padding: 8 }}>
                      <div style={{ flex: "1 1 140px", fontWeight: 600, fontSize: 13 }}>{p.posto}</div>
                      <Field label="Diesel R$/L">
                        <input type="number" step="0.01" style={{ ...inputStyle, width: 90 }} value={p.precoDiesel} onChange={(e) => updatePrecoPosto(p.id, "precoDiesel", e.target.value)} />
                      </Field>
                      <Field label="Arla R$/L">
                        <input type="number" step="0.01" style={{ ...inputStyle, width: 90 }} value={p.precoArla} onChange={(e) => updatePrecoPosto(p.id, "precoArla", e.target.value)} />
                      </Field>
                      <button onClick={() => removePrecoPosto(p.id)} style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 18, alignSelf: "flex-end", paddingBottom: 8 }}>×</button>
                    </div>
                  ))}
                  {precosPostos.length === 0 && <div style={{ fontSize: 12, color: "#9AA5B1" }}>Nenhum posto com preço combinado cadastrado ainda.</div>}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <input
                    list="lista-postos-preco"
                    value={novoPostoPrecoNome}
                    onChange={(e) => setNovoPostoPrecoNome(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && novoPostoPrecoNome.trim()) { addPrecoPosto(novoPostoPrecoNome); setNovoPostoPrecoNome(""); } }}
                    placeholder="Nome do posto"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <datalist id="lista-postos-preco">
                    {abastecPostosList.map((p) => <option key={p} value={p} />)}
                  </datalist>
                  <button
                    onClick={() => { if (novoPostoPrecoNome.trim()) { addPrecoPosto(novoPostoPrecoNome); setNovoPostoPrecoNome(""); } }}
                    style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "0 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                  >
                    + Adicionar
                  </button>
                </div>
              </div>
            )}

            {/* seção: seguradoras */}
            <button
              onClick={() => setConfigSecaoAberta(configSecaoAberta === "seguradoras" ? null : "seguradoras")}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F7F8F9", border: "none", borderRadius: 10, padding: "10px 14px", marginBottom: configSecaoAberta === "seguradoras" ? 12 : 8, cursor: "pointer" }}
            >
              <span style={{ fontWeight: 700, fontSize: 13 }}>🛡️ Vencimento por seguradora</span>
              <span style={{ fontSize: 11, color: "#9AA5B1", transform: configSecaoAberta === "seguradoras" ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▾</span>
            </button>
            {configSecaoAberta === "seguradoras" && (
              <div style={{ padding: "0 4px", marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "#5A6472", marginBottom: 8 }}>
              Seguradora sem regra aqui usa dia 15 com antecipação, por padrão.
            </div>
            {configRegrasVencimentoEdit.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                <input
                  value={r.seguradora}
                  onChange={(e) => atualizarRegraVencimento(i, "seguradora", e.target.value.toUpperCase())}
                  placeholder="seguradora"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <span style={{ fontSize: 12, color: "#5A6472" }}>dia</span>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={r.dia}
                  onChange={(e) => atualizarRegraVencimento(i, "dia", Number(e.target.value))}
                  style={{ ...inputStyle, width: 56 }}
                />
                <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#5A6472", whiteSpace: "nowrap" }}>
                  <input
                    type="checkbox"
                    checked={r.antecipaFimDeSemana}
                    onChange={(e) => atualizarRegraVencimento(i, "antecipaFimDeSemana", e.target.checked)}
                  />
                  antecipa
                </label>
                <button onClick={() => removerRegraVencimento(i)} style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 16 }}>×</button>
              </div>
            ))}
            <button
              onClick={adicionarRegraVencimento}
              style={{ border: "1px dashed #B7BFC8", background: "transparent", borderRadius: 10, padding: "6px 12px", fontSize: 12, color: "#5A6472", cursor: "pointer" }}
            >
              + adicionar seguradora
            </button>
              </div>
            )}

            {/* seção: caminhões */}
            <button
              onClick={() => setConfigSecaoAberta(configSecaoAberta === "caminhoes" ? null : "caminhoes")}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F7F8F9", border: "none", borderRadius: 10, padding: "10px 14px", marginBottom: configSecaoAberta === "caminhoes" ? 12 : 8, cursor: "pointer" }}
            >
              <span style={{ fontWeight: 700, fontSize: 13 }}>🚚 Caminhões (foto, modelo e documentação)</span>
              <span style={{ fontSize: 11, color: "#9AA5B1", transform: configSecaoAberta === "caminhoes" ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▾</span>
            </button>
            {configSecaoAberta === "caminhoes" && (
              <div style={{ padding: "0 4px", marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "#5A6472", marginBottom: 10 }}>
              Foto e modelo aparecem no topo quando você seleciona a placa em Viagens/Abastecimentos. Clica numa placa pra abrir os dados de CRLV (útil pra multa e documentação, sem precisar pegar o papel).
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {trucksCavalos.map((tr) => {
                const aberto = caminhaoExpandidoId === tr.id;
                return (
                <div key={tr.id} style={{ background: "#F7F8F9", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", padding: 10 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 12, overflow: "hidden", background: "#EEF0F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {tr.foto ? (
                        <img src={tr.foto} alt={tr.placa} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <TruckIcon size={34} />
                      )}
                    </div>
                    <div
                      onClick={() => setCaminhaoExpandidoId(aberto ? null : tr.id)}
                      style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums", display: "flex", alignItems: "center", gap: 6 }}>
                        {tr.placa}
                        <span style={{ fontSize: 10, color: "#9AA5B1", transform: aberto ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▾</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#5A6472" }}>{tr.modelo || "Modelo não cadastrado — clique pra preencher"}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={{ fontSize: 11, color: "#2451A6", cursor: "pointer", textAlign: "center", border: "1px solid #D7DBE0", borderRadius: 10, padding: "4px 8px" }}>
                        {tr.foto ? "Trocar foto" : "+ foto"}
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (!file) return;
                            redimensionarFotoCaminhao(file, (base64) => updateTruckInfo(tr.id, { foto: base64 }));
                            e.target.value = "";
                          }}
                        />
                      </label>
                      {tr.foto && (
                        <button
                          onClick={() => updateTruckInfo(tr.id, { foto: "" })}
                          style={{ fontSize: 11, color: "#B0402E", background: "none", border: "none", cursor: "pointer" }}
                        >
                          remover foto
                        </button>
                      )}
                    </div>
                  </div>
                  {aberto && (
                    <div style={{ padding: "0 10px 12px 10px", display: "flex", flexDirection: "column", gap: 8 }}>
                      <Field label="Placa">
                        <input
                          value={tr.placa || ""}
                          onChange={(e) => updateTruckInfo(tr.id, { placa: e.target.value.toUpperCase() })}
                          style={{ ...inputStyle, fontSize: 12, padding: "6px 8px", fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums" }}
                        />
                      </Field>
                      <Field label="Modelo">
                        <input
                          value={tr.modelo || ""}
                          onChange={(e) => updateTruckInfo(tr.id, { modelo: e.target.value })}
                          placeholder="ex: Mercedes Benz 2546"
                          style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }}
                        />
                      </Field>
                      <button
                        onClick={() => { if (window.confirm(`Marcar ${tr.placa} como CARRETA?`)) alternarTipoPlaca(tr.id); }}
                        style={{ background: "none", border: "1px dashed #B7BFC8", color: "#5A6472", borderRadius: 8, padding: "4px 10px", fontSize: 11, cursor: "pointer", alignSelf: "flex-start" }}
                      >
                        🔁 Marcar como carreta (cadastrada errado?)
                      </button>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 140px" }}>
                          <Field label="RENAVAM">
                            <input value={tr.renavam || ""} onChange={(e) => updateTruckInfo(tr.id, { renavam: onlyDigits(e.target.value) })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                        <div style={{ flex: "1 1 180px" }}>
                          <Field label="Chassi">
                            <input value={tr.chassi || ""} onChange={(e) => updateTruckInfo(tr.id, { chassi: e.target.value.toUpperCase() })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                        <div style={{ flex: "1 1 140px" }}>
                          <Field label="CRV">
                            <input value={tr.crv || ""} onChange={(e) => updateTruckInfo(tr.id, { crv: onlyDigits(e.target.value) })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 100px" }}>
                          <Field label="Ano fabricação">
                            <input value={tr.anoFabricacao || ""} onChange={(e) => updateTruckInfo(tr.id, { anoFabricacao: onlyDigits(e.target.value) })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                        <div style={{ flex: "1 1 100px" }}>
                          <Field label="Ano modelo">
                            <input value={tr.anoModelo || ""} onChange={(e) => updateTruckInfo(tr.id, { anoModelo: onlyDigits(e.target.value) })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                        <div style={{ flex: "1 1 100px" }}>
                          <Field label="Cor">
                            <input value={tr.cor || ""} onChange={(e) => updateTruckInfo(tr.id, { cor: e.target.value })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                        <div style={{ flex: "1 1 120px" }}>
                          <Field label="Combustível">
                            <input value={tr.combustivel || ""} onChange={(e) => updateTruckInfo(tr.id, { combustivel: e.target.value })} placeholder="Diesel" style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 140px" }}>
                          <Field label="Categoria">
                            <input value={tr.categoria || ""} onChange={(e) => updateTruckInfo(tr.id, { categoria: e.target.value })} placeholder="ex: Trator" style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                        <div style={{ flex: "1 1 140px" }}>
                          <Field label="Município">
                            <input value={tr.municipio || ""} onChange={(e) => updateTruckInfo(tr.id, { municipio: e.target.value })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                        <div style={{ flex: "0 0 70px" }}>
                          <Field label="UF">
                            <input value={tr.uf || ""} onChange={(e) => updateTruckInfo(tr.id, { uf: e.target.value.toUpperCase().slice(0, 2) })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                      </div>
                      <div>
                        <Field label="Vencimento do licenciamento/documento (opcional, só referência)">
                          <input type="date" value={tr.vencimentoDocumento || ""} onChange={(e) => updateTruckInfo(tr.id, { vencimentoDocumento: e.target.value })} onBlur={(e) => updateTruckInfo(tr.id, { vencimentoDocumento: corrigirAnoDigitado(e.target.value) })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                        </Field>
                      </div>
                      <div>
                        <Field label="Carreta vinculada (preenche sozinho ao lançar Seguro)">
                          <select
                            value={tr.carretaVinculadaId || ""}
                            onChange={(e) => updateTruckInfo(tr.id, { carretaVinculadaId: e.target.value })}
                            style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }}
                          >
                            <option value="">Nenhuma / varia</option>
                            {trucksCarretas.map((c) => <option key={c.id} value={c.id}>{c.placa}{c.modelo ? ` — ${c.modelo}` : ""}</option>)}
                          </select>
                        </Field>
                      </div>

                      <div style={{ background: "#fff", border: "1px solid #E4E7EB", borderRadius: 10, padding: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>📄 Documento anual (CRLV)</div>
                        <div style={{ fontSize: 11, color: "#9AA5B1", marginBottom: 8 }}>
                          Anexa uma foto do documento pago de cada ano — o sistema avisa sozinho se o ano atual ainda não tiver nada anexado.
                        </div>
                        {(() => {
                          const anoAtual = new Date().getFullYear();
                          const documentos = tr.documentosPorAno || {};
                          const temAnoAtual = !!documentos[anoAtual];
                          return (
                            <>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, background: temAnoAtual ? "#E9F5F1" : "#FBEBE8", borderRadius: 8, padding: "8px 10px" }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: temAnoAtual ? "#12503F" : "#7A2A1D", flex: 1 }}>
                                  {temAnoAtual ? `✅ ${anoAtual} anexado` : `⚠️ ${anoAtual} ainda não anexado`}
                                </span>
                                <label style={{ fontSize: 11, color: enviandoDocId === tr.id ? "#9AA5B1" : "#2451A6", cursor: enviandoDocId === tr.id ? "default" : "pointer", border: "1px solid #D7DBE0", borderRadius: 8, padding: "5px 10px", background: "#fff", whiteSpace: "nowrap" }}>
                                  {enviandoDocId === tr.id ? "Enviando..." : (temAnoAtual ? "Trocar" : "+ anexar")}
                                  <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    disabled={enviandoDocId === tr.id}
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                      const file = e.target.files && e.target.files[0];
                                      if (!file) return;
                                      anexarDocumentoAnual(tr, anoAtual, file);
                                      e.target.value = "";
                                    }}
                                  />
                                </label>
                              </div>
                              {Object.keys(documentos).filter((ano) => Number(ano) !== anoAtual).sort((a, b) => b - a).length > 0 && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  <div style={{ fontSize: 10, color: "#9AA5B1", textTransform: "uppercase", fontWeight: 700 }}>Anos anteriores</div>
                                  {Object.keys(documentos).filter((ano) => Number(ano) !== anoAtual).sort((a, b) => b - a).map((ano) => (
                                    <div key={ano} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                                      <span style={{ flex: 1 }}>{ano}</span>
                                      <a href={documentos[ano]} target="_blank" rel="noreferrer" style={{ color: "#2451A6", fontSize: 11 }}>ver</a>
                                      <button
                                        onClick={() => {
                                          const copia = { ...documentos };
                                          delete copia[ano];
                                          updateTruckInfo(tr.id, { documentosPorAno: copia });
                                        }}
                                        style={{ background: "none", border: "none", color: "#B0402E", fontSize: 11, cursor: "pointer" }}
                                      >
                                        remover
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                      <div style={{ background: "#fff", border: "1px solid #E4E7EB", borderRadius: 10, padding: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>💰 IPVA do ano</div>
                        <div style={{ fontSize: 11, color: "#9AA5B1", marginBottom: 8 }}>
                          Separado do documento — às vezes o IPVA já foi pago mas o CRLV do ano ainda não saiu.
                        </div>
                        {(() => {
                          const anoAtual = new Date().getFullYear();
                          const ipvaPago = tr.ipvaPagoPorAno || {};
                          const pagoEsteAno = !!ipvaPago[anoAtual];
                          return (
                            <div
                              onClick={() => updateTruckInfo(tr.id, { ipvaPagoPorAno: { ...ipvaPago, [anoAtual]: !pagoEsteAno } })}
                              style={{ display: "flex", alignItems: "center", gap: 8, background: pagoEsteAno ? "#E9F5F1" : "#FBEBE8", borderRadius: 8, padding: "8px 10px", cursor: "pointer" }}
                            >
                              <span style={{ fontSize: 12, fontWeight: 700, color: pagoEsteAno ? "#12503F" : "#7A2A1D", flex: 1 }}>
                                {pagoEsteAno ? `✅ IPVA ${anoAtual} pago` : `⚠️ IPVA ${anoAtual} pendente`}
                              </span>
                              <span style={{ fontSize: 11, color: "#2451A6", border: "1px solid #D7DBE0", borderRadius: 8, padding: "5px 10px", background: "#fff" }}>
                                {pagoEsteAno ? "Desmarcar" : "Marcar pago"}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
              </div>
            )}

            {/* seção: carretas */}
            <button
              onClick={() => setConfigSecaoAberta(configSecaoAberta === "carretas" ? null : "carretas")}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F7F8F9", border: "none", borderRadius: 10, padding: "10px 14px", marginBottom: configSecaoAberta === "carretas" ? 12 : 8, cursor: "pointer" }}
            >
              <span style={{ fontWeight: 700, fontSize: 13 }}>🚛 Carretas (documentação)</span>
              <span style={{ fontSize: 11, color: "#9AA5B1", transform: configSecaoAberta === "carretas" ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▾</span>
            </button>
            {configSecaoAberta === "carretas" && (
              <div style={{ padding: "0 4px", marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "#5A6472", marginBottom: 10 }}>
              Carreta não precisa de foto — só a documentação, pra ter tudo à mão sem precisar do papel.
            </div>
            {trucksCarretas.length === 0 ? (
              <div style={{ fontSize: 12, color: "#9AA5B1", padding: "8px 0" }}>Nenhuma carreta cadastrada ainda.</div>
            ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {trucksCarretas.map((tr) => {
                const aberto = caminhaoExpandidoId === tr.id;
                return (
                <div key={tr.id} style={{ background: "#F7F8F9", borderRadius: 12, overflow: "hidden" }}>
                  <div
                    onClick={() => setCaminhaoExpandidoId(aberto ? null : tr.id)}
                    style={{ display: "flex", gap: 10, alignItems: "center", padding: 10, cursor: "pointer" }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EEF0F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <TruckIcon size={24} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums", display: "flex", alignItems: "center", gap: 6 }}>
                        {tr.placa}
                        <span style={{ fontSize: 10, color: "#9AA5B1", transform: aberto ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▾</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#5A6472" }}>{tr.modelo || "Modelo não cadastrado — clique pra preencher"}</div>
                    </div>
                  </div>
                  {aberto && (
                    <div style={{ padding: "0 10px 12px 10px", display: "flex", flexDirection: "column", gap: 8 }}>
                      <Field label="Placa">
                        <input
                          value={tr.placa || ""}
                          onChange={(e) => updateTruckInfo(tr.id, { placa: e.target.value.toUpperCase() })}
                          style={{ ...inputStyle, fontSize: 12, padding: "6px 8px", fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums" }}
                        />
                      </Field>
                      <Field label="Modelo">
                        <input
                          value={tr.modelo || ""}
                          onChange={(e) => updateTruckInfo(tr.id, { modelo: e.target.value })}
                          placeholder="ex: Sider, Graneleiro, Reboque"
                          style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }}
                        />
                      </Field>
                      <button
                        onClick={() => { if (window.confirm(`Marcar ${tr.placa} como CAVALO?`)) alternarTipoPlaca(tr.id); }}
                        style={{ background: "none", border: "1px dashed #B7BFC8", color: "#5A6472", borderRadius: 8, padding: "4px 10px", fontSize: 11, cursor: "pointer", alignSelf: "flex-start" }}
                      >
                        🔁 Marcar como cavalo (cadastrada errado?)
                      </button>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 140px" }}>
                          <Field label="RENAVAM">
                            <input value={tr.renavam || ""} onChange={(e) => updateTruckInfo(tr.id, { renavam: onlyDigits(e.target.value) })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                        <div style={{ flex: "1 1 180px" }}>
                          <Field label="Chassi">
                            <input value={tr.chassi || ""} onChange={(e) => updateTruckInfo(tr.id, { chassi: e.target.value.toUpperCase() })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                        <div style={{ flex: "1 1 140px" }}>
                          <Field label="CRV">
                            <input value={tr.crv || ""} onChange={(e) => updateTruckInfo(tr.id, { crv: onlyDigits(e.target.value) })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 100px" }}>
                          <Field label="Ano fabricação">
                            <input value={tr.anoFabricacao || ""} onChange={(e) => updateTruckInfo(tr.id, { anoFabricacao: onlyDigits(e.target.value) })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                        <div style={{ flex: "1 1 100px" }}>
                          <Field label="Ano modelo">
                            <input value={tr.anoModelo || ""} onChange={(e) => updateTruckInfo(tr.id, { anoModelo: onlyDigits(e.target.value) })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                        <div style={{ flex: "1 1 100px" }}>
                          <Field label="Cor">
                            <input value={tr.cor || ""} onChange={(e) => updateTruckInfo(tr.id, { cor: e.target.value })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                        <div style={{ flex: "1 1 120px" }}>
                          <Field label="Categoria">
                            <input value={tr.categoria || ""} onChange={(e) => updateTruckInfo(tr.id, { categoria: e.target.value })} placeholder="ex: Reboque" style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 140px" }}>
                          <Field label="Município">
                            <input value={tr.municipio || ""} onChange={(e) => updateTruckInfo(tr.id, { municipio: e.target.value })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                        <div style={{ flex: "0 0 70px" }}>
                          <Field label="UF">
                            <input value={tr.uf || ""} onChange={(e) => updateTruckInfo(tr.id, { uf: e.target.value.toUpperCase().slice(0, 2) })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                          </Field>
                        </div>
                      </div>
                      <div>
                        <Field label="Vencimento do licenciamento/documento (opcional, só referência)">
                          <input type="date" value={tr.vencimentoDocumento || ""} onChange={(e) => updateTruckInfo(tr.id, { vencimentoDocumento: e.target.value })} onBlur={(e) => updateTruckInfo(tr.id, { vencimentoDocumento: corrigirAnoDigitado(e.target.value) })} style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }} />
                        </Field>
                      </div>

                      <div style={{ background: "#fff", border: "1px solid #E4E7EB", borderRadius: 10, padding: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>📄 Documento anual (CRLV)</div>
                        <div style={{ fontSize: 11, color: "#9AA5B1", marginBottom: 8 }}>
                          Anexa uma foto do documento pago de cada ano — o sistema avisa sozinho se o ano atual ainda não tiver nada anexado.
                        </div>
                        {(() => {
                          const anoAtual = new Date().getFullYear();
                          const documentos = tr.documentosPorAno || {};
                          const temAnoAtual = !!documentos[anoAtual];
                          return (
                            <>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, background: temAnoAtual ? "#E9F5F1" : "#FBEBE8", borderRadius: 8, padding: "8px 10px" }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: temAnoAtual ? "#12503F" : "#7A2A1D", flex: 1 }}>
                                  {temAnoAtual ? `✅ ${anoAtual} anexado` : `⚠️ ${anoAtual} ainda não anexado`}
                                </span>
                                <label style={{ fontSize: 11, color: enviandoDocId === tr.id ? "#9AA5B1" : "#2451A6", cursor: enviandoDocId === tr.id ? "default" : "pointer", border: "1px solid #D7DBE0", borderRadius: 8, padding: "5px 10px", background: "#fff", whiteSpace: "nowrap" }}>
                                  {enviandoDocId === tr.id ? "Enviando..." : (temAnoAtual ? "Trocar" : "+ anexar")}
                                  <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    disabled={enviandoDocId === tr.id}
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                      const file = e.target.files && e.target.files[0];
                                      if (!file) return;
                                      anexarDocumentoAnual(tr, anoAtual, file);
                                      e.target.value = "";
                                    }}
                                  />
                                </label>
                              </div>
                              {Object.keys(documentos).filter((ano) => Number(ano) !== anoAtual).sort((a, b) => b - a).length > 0 && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  <div style={{ fontSize: 10, color: "#9AA5B1", textTransform: "uppercase", fontWeight: 700 }}>Anos anteriores</div>
                                  {Object.keys(documentos).filter((ano) => Number(ano) !== anoAtual).sort((a, b) => b - a).map((ano) => (
                                    <div key={ano} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                                      <span style={{ flex: 1 }}>{ano}</span>
                                      <a href={documentos[ano]} target="_blank" rel="noreferrer" style={{ color: "#2451A6", fontSize: 11 }}>ver</a>
                                      <button
                                        onClick={() => {
                                          const copia = { ...documentos };
                                          delete copia[ano];
                                          updateTruckInfo(tr.id, { documentosPorAno: copia });
                                        }}
                                        style={{ background: "none", border: "none", color: "#B0402E", fontSize: 11, cursor: "pointer" }}
                                      >
                                        remover
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                      <div style={{ background: "#fff", border: "1px solid #E4E7EB", borderRadius: 10, padding: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>💰 Taxa de licenciamento do ano</div>
                        <div style={{ fontSize: 11, color: "#9AA5B1", marginBottom: 8 }}>
                          Carreta não paga IPVA, só a taxa de licenciamento — separado do documento, já que às vezes ela já foi paga mas o CRLV do ano ainda não saiu.
                        </div>
                        {(() => {
                          const anoAtual = new Date().getFullYear();
                          const ipvaPago = tr.ipvaPagoPorAno || {};
                          const pagoEsteAno = !!ipvaPago[anoAtual];
                          return (
                            <div
                              onClick={() => updateTruckInfo(tr.id, { ipvaPagoPorAno: { ...ipvaPago, [anoAtual]: !pagoEsteAno } })}
                              style={{ display: "flex", alignItems: "center", gap: 8, background: pagoEsteAno ? "#E9F5F1" : "#FBEBE8", borderRadius: 8, padding: "8px 10px", cursor: "pointer" }}
                            >
                              <span style={{ fontSize: 12, fontWeight: 700, color: pagoEsteAno ? "#12503F" : "#7A2A1D", flex: 1 }}>
                                {pagoEsteAno ? `✅ Licenciamento ${anoAtual} pago` : `⚠️ Licenciamento ${anoAtual} pendente`}
                              </span>
                              <span style={{ fontSize: 11, color: "#2451A6", border: "1px solid #D7DBE0", borderRadius: 8, padding: "5px 10px", background: "#fff" }}>
                                {pagoEsteAno ? "Desmarcar" : "Marcar pago"}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
            )}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={salvarConfiguracoes} style={{ flex: 1, background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, cursor: "pointer" }}>
                Salvar
              </button>
              <button onClick={() => { setConfigOpen(false); }} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 10, padding: "10px 16px", cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* slide-over panel */}
      {panelOpen && editing && (
        <>
          <div
            onClick={fecharPainelViagem}
            style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20 }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(1100px, 96vw)",
              background: "#fff",
              zIndex: 21,
              overflowY: "auto",
              boxShadow: "-8px 0 24px rgba(0,0,0,0.15)",
              padding: "24px 24px 100px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 22 }}>
                {trips.some((t) => t.id === editing.id) ? "Editar viagem" : "Nova viagem"}
              </div>
              <button
                onClick={fecharPainelViagem}
                style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            <datalist id="postos-datalist">
              {postosList.map((p) => <option key={p} value={p} />)}
            </datalist>
            <datalist id="categorias-gasto-datalist">
              {categoriasGastoList.map((c) => <option key={c} value={c} />)}
            </datalist>
            <datalist id="setores-gasto-datalist">
              {setoresGastoList.map((s) => <option key={s} value={s} />)}
            </datalist>

            <fieldset disabled={tripTravada} style={{ border: "none", padding: 0, margin: 0 }}>
            <div className="grid-duas-colunas-viagem" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
            <div>
            <Section title="Viagem" icon="🚚">
              <Field label="Caminhão">
                <select
                  value={editing.caminhaoId}
                  onChange={(e) => setEditing({ ...editing, caminhaoId: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">Selecione</option>
                  {trucksCavalos.map((tr) => (
                    <option key={tr.id} value={tr.id}>{tr.placa}</option>
                  ))}
                </select>
              </Field>
              <Field label="Data">
                <input type="date" style={inputStyle} value={editing.data} onChange={(e) => setEditing({ ...editing, data: e.target.value })} onBlur={(e) => setEditing({ ...editing, data: corrigirAnoDigitado(e.target.value) })} />
              </Field>
              <Field label="Origem">
                <input style={inputStyle} value={editing.origem} onChange={(e) => setEditing({ ...editing, origem: e.target.value })} />
              </Field>
              <Field label="Destino">
                <input style={inputStyle} value={editing.destino} onChange={(e) => setEditing({ ...editing, destino: e.target.value })} />
              </Field>
              <Field label="KM início">
                <input type="text" inputMode="numeric" style={inputStyle} value={editing.kmInicio} onChange={(e) => setEditing({ ...editing, kmInicio: onlyDigits(e.target.value) })} />
              </Field>
              <Field label="KM fim">
                <input type="text" inputMode="numeric" style={inputStyle} value={editing.kmFim} onChange={(e) => setEditing({ ...editing, kmFim: onlyDigits(e.target.value) })} />
              </Field>
              <Field label="Data fim da viagem">
                <input type="date" style={inputStyle} value={editing.dataFim} onChange={(e) => setEditing({ ...editing, dataFim: e.target.value })} onBlur={(e) => setEditing({ ...editing, dataFim: corrigirAnoDigitado(e.target.value) })} />
              </Field>
              <Field label="Contrato">
                <input style={inputStyle} value={editing.contrato} onChange={(e) => setEditing({ ...editing, contrato: e.target.value })} />
              </Field>
            </Section>

            <Section title="Financeiro" icon="💰">
              <Field label="Empresa">
                <input style={inputStyle} value={editing.empresa} onChange={(e) => setEditing({ ...editing, empresa: e.target.value })} />
              </Field>
              <Field label="Motorista">
                {motoristaCustomMode ? (
                  <input
                    style={inputStyle}
                    value={editing.motorista}
                    onChange={(e) => setEditing({ ...editing, motorista: e.target.value })}
                    placeholder="nome do novo motorista"
                    autoFocus
                  />
                ) : (
                  <select
                    style={inputStyle}
                    value={motoristasList.includes(editing.motorista) ? editing.motorista : ""}
                    onChange={(e) => {
                      if (e.target.value === "__novo__") {
                        setMotoristaCustomMode(true);
                        setEditing({ ...editing, motorista: "" });
                      } else {
                        setEditing({ ...editing, motorista: e.target.value });
                      }
                    }}
                  >
                    <option value="">Selecione</option>
                    {motoristasList.map((nome) => <option key={nome} value={nome}>{nome}</option>)}
                    <option value="__novo__">+ novo motorista...</option>
                  </select>
                )}
                {motoristaCustomMode && (
                  <button
                    type="button"
                    onClick={() => { setMotoristaCustomMode(false); setEditing({ ...editing, motorista: "" }); }}
                    style={{ fontSize: 11, color: "#5A6472", background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 4, textDecoration: "underline", textAlign: "left" }}
                  >
                    usar motorista já cadastrado
                  </button>
                )}
              </Field>
              <Field label="Adiantamento (R$)">
                <input type="number" style={inputStyle} value={editing.adiantamento} onChange={(e) => setEditing({ ...editing, adiantamento: e.target.value })} />
              </Field>
              <Field label="Data recebimento adiantamento">
                <input type="date" style={inputStyle} value={editing.dataRecebAdiantamento} onChange={(e) => setEditing({ ...editing, dataRecebAdiantamento: e.target.value })} onBlur={(e) => setEditing({ ...editing, dataRecebAdiantamento: corrigirAnoDigitado(e.target.value) })} />
              </Field>
              <Field label="Saldo a receber (R$)">
                <input type="number" style={inputStyle} value={editing.saldoReceber} onChange={(e) => setEditing({ ...editing, saldoReceber: e.target.value })} />
              </Field>
              <Field label="Data pagamento do saldo">
                <input type="date" style={inputStyle} value={editing.dataPagamentoSaldo} onChange={(e) => setEditing({ ...editing, dataPagamentoSaldo: e.target.value })} onBlur={(e) => setEditing({ ...editing, dataPagamentoSaldo: corrigirAnoDigitado(e.target.value) })} />
              </Field>
              <Field label="Valor p/ comissão (R$)">
                <input type="number" style={inputStyle} value={editing.valorComissaoBase} onChange={(e) => setEditing({ ...editing, valorComissaoBase: e.target.value })} />
              </Field>
              <Field label="Pedágio (R$)">
                <input type="number" style={inputStyle} value={editing.pedagio} onChange={(e) => setEditing({ ...editing, pedagio: e.target.value })} />
              </Field>
              <Field label="Carregamento (R$)">
                <input
                  type="number"
                  style={inputStyle}
                  value={editing.carregamento}
                  onChange={(e) => setEditing({ ...editing, carregamento: e.target.value })}
                  placeholder="deixe em branco se não teve"
                  title="Troca de motorista — preencha só quando outro motorista foi carregar e recebeu por isso — esse valor é descontado antes de calcular os 13%"
                />
              </Field>
              {Number(editing.carregamento) > 0 && (
                <Field label="Motorista do carregamento">
                  <select
                    style={inputStyle}
                    value={editing.carregamentoMotorista}
                    onChange={(e) => setEditing({ ...editing, carregamentoMotorista: e.target.value })}
                  >
                    <option value="">Selecione quem recebe esse valor</option>
                    {motoristasList.map((nome) => <option key={nome} value={nome}>{nome}</option>)}
                  </select>
                </Field>
              )}
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#5A6472", gridColumn: "1 / -1", marginTop: 4 }}>
                <input
                  type="checkbox"
                  checked={!!editing.comissaoFixa}
                  onChange={(e) => setEditing({ ...editing, comissaoFixa: e.target.checked })}
                />
                Comissão com valor fixo
                <span title="Não calcula os 13% — usa direto pra rota curta/transferência" style={{ cursor: "help", color: "#9AA5B1" }}>ⓘ</span>
              </label>
              {editing.comissaoFixa && (
                <Field label="Valor fixo da comissão (R$)">
                  <input type="number" style={inputStyle} value={editing.valorComissaoFixa} onChange={(e) => setEditing({ ...editing, valorComissaoFixa: e.target.value })} />
                </Field>
              )}
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#5A6472", gridColumn: "1 / -1", marginTop: 4 }}>
                <input
                  type="checkbox"
                  checked={!!editing.comissaoJaPaga}
                  onChange={(e) => setEditing({ ...editing, comissaoJaPaga: e.target.checked })}
                />
                Comissão já foi paga fora do sistema
                <span title='Viagem antiga — entra no relatório mensal, mas não aparece como "a receber" do motorista' style={{ cursor: "help", color: "#9AA5B1" }}>ⓘ</span>
              </label>
            </Section>
            </div>

            <div>
            <RepeatingSection
              title="Abastecimentos"
              icon="⛽"
              items={editing.abastecimentos}
              onAdd={() => setEditing({ ...editing, abastecimentos: [...editing.abastecimentos, emptyAbastecimento()] })}
              onRemove={(id) => setEditing({ ...editing, abastecimentos: editing.abastecimentos.filter((a) => a.id !== id) })}
              onUpdate={(id, updated) => setEditing({ ...editing, abastecimentos: editing.abastecimentos.map((a) => (a.id === id ? updated : a)) })}
              addLabel="+ adicionar abastecimento"
              addColor="#1F6F5C"
              renderItem={(item, update) => (
                <>
                  <Field label="Data">
                    <input type="date" style={inputStyle} value={item.data} onChange={(e) => update({ ...item, data: e.target.value })} onBlur={(e) => update({ ...item, data: corrigirAnoDigitado(e.target.value) })} />
                  </Field>
                  <Field label="Tipo">
                    <select style={inputStyle} value={item.tipo || "diesel"} onChange={(e) => update({ ...item, tipo: e.target.value })}>
                      <option value="diesel">Diesel</option>
                      <option value="arla">Arla</option>
                    </select>
                  </Field>
                  <Field label="Litragem">
                    <input type="number" style={inputStyle} value={item.litragem} onChange={(e) => update({ ...item, litragem: e.target.value })} />
                  </Field>
                  <Field label="KM">
                    <input type="text" inputMode="numeric" style={inputStyle} value={item.km} onChange={(e) => update({ ...item, km: onlyDigits(e.target.value) })} />
                  </Field>
                  <Field label="Valor (R$)">
                    <input type="number" style={inputStyle} value={item.valor} onChange={(e) => update({ ...item, valor: e.target.value })} />
                  </Field>
                  <Field label="Posto">
                    <input style={inputStyle} list="postos-datalist" value={item.posto} onChange={(e) => update({ ...item, posto: e.target.value })} />
                  </Field>
                  <Field label="Nº cupom / NFC-e">
                    <input style={inputStyle} value={item.numeroCupom} onChange={(e) => update({ ...item, numeroCupom: e.target.value })} placeholder="ex: 000247827" />
                  </Field>
                  {(() => {
                    const litros = Number(item.litragem) || 0;
                    const valor = Number(item.valor) || 0;
                    if (litros <= 0 || valor <= 0 || !item.posto) return null;
                    const combinado = precosPostos.find((p) => p.posto.toUpperCase() === item.posto.trim().toUpperCase());
                    if (!combinado) return null;
                    const precoCombinado = Number(item.tipo === "arla" ? combinado.precoArla : combinado.precoDiesel) || 0;
                    if (precoCombinado <= 0) return null;
                    const precoLancado = valor / litros;
                    const diferenca = precoLancado - precoCombinado;
                    if (Math.abs(diferenca) <= 0.02) return null;
                    return (
                      <div style={{ gridColumn: "1 / -1", background: "#FBEBE8", border: "1px solid #B0402E55", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "#7A2A1D" }}>
                        ⚠️ Preço lançado nesse posto: <strong>{BRL(precoLancado)}/L</strong> — o combinado é{" "}
                        <strong>{BRL(precoCombinado)}/L</strong> ({diferenca > 0 ? "cobrando" : "abaixo do combinado, cobrando"}{" "}
                        {BRL(Math.abs(diferenca))} {diferenca > 0 ? "a mais" : "a menos"} por litro).
                      </div>
                    );
                  })()}
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5A6472", gridColumn: "1 / -1" }}>
                    <input
                      type="checkbox"
                      checked={!!item.paraComissao}
                      onChange={(e) => update({ ...item, paraComissao: e.target.checked })}
                    />
                    Motorista pagou do próprio bolso — enviar como reembolso na comissão dele
                  </label>
                </>
              )}
            />

            <RepeatingSection
              title="Gastos extras"
              icon="🧾"
              items={editing.gastosExtras}
              onAdd={() => setEditing({ ...editing, gastosExtras: [...editing.gastosExtras, emptyGasto()] })}
              onRemove={(id) => setEditing({ ...editing, gastosExtras: editing.gastosExtras.filter((g) => g.id !== id) })}
              onUpdate={(id, updated) => setEditing({ ...editing, gastosExtras: editing.gastosExtras.map((g) => (g.id === id ? updated : g)) })}
              addLabel="+ adicionar gasto"
              renderItem={(item, update) => (
                <>
                  <Field label="Data">
                    <input type="date" style={inputStyle} value={item.data} onChange={(e) => update({ ...item, data: e.target.value })} onBlur={(e) => update({ ...item, data: corrigirAnoDigitado(e.target.value) })} />
                  </Field>
                  <Field label="Valor (R$)">
                    <input type="number" style={inputStyle} value={item.valor} onChange={(e) => update({ ...item, valor: e.target.value })} />
                  </Field>
                  <Field label="Descrição">
                    <input style={inputStyle} value={item.descricao} onChange={(e) => update({ ...item, descricao: e.target.value })} placeholder="ex: Lubrificação" />
                  </Field>
                  <Field label={<>Categoria <span title="Opcional" style={{ cursor: "help", color: "#9AA5B1" }}>ⓘ</span></>}>
                    <input style={inputStyle} list="categorias-gasto-datalist" value={item.categoria || ""} onChange={(e) => update({ ...item, categoria: e.target.value })} placeholder="ex: Despesas Estrada" />
                  </Field>
                  <Field label={<>Setor <span title="Opcional — só se quiser separar um tipo específico, tipo Borracharia ou Lavador" style={{ cursor: "help", color: "#9AA5B1" }}>ⓘ</span></>}>
                    <input style={inputStyle} list="setores-gasto-datalist" value={item.setor || ""} onChange={(e) => update({ ...item, setor: e.target.value })} placeholder="ex: Borracharia Miradouro" />
                  </Field>
                  <Field label={<>Posto <span title="Preenche se for do mesmo cupom/posto do abastecimento" style={{ cursor: "help", color: "#9AA5B1" }}>ⓘ</span></>}>
                    <input style={inputStyle} list="postos-datalist" value={item.posto} onChange={(e) => update({ ...item, posto: e.target.value })} />
                  </Field>
                  <Field label="Nº cupom / NFC-e">
                    <input style={inputStyle} value={item.numeroCupom} onChange={(e) => update({ ...item, numeroCupom: e.target.value })} placeholder="mesmo número do abastecimento" />
                  </Field>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5A6472", gridColumn: "1 / -1" }}>
                    <input
                      type="checkbox"
                      checked={!!item.paraComissao}
                      onChange={(e) => update({ ...item, paraComissao: e.target.checked })}
                    />
                    Motorista pagou do próprio bolso — enviar como reembolso na comissão dele
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5A6472", gridColumn: "1 / -1", marginTop: 4 }}>
                    <input
                      type="checkbox"
                      checked={!!item.importante}
                      onChange={(e) => update({ ...item, importante: e.target.checked })}
                    />
                    Marcar como serviço importante (aparece no relatório "Outros Serviços Importantes", junto com as trocas de óleo)
                  </label>
                  {item.importante && (
                    <Field label={<>KM do caminhão <span title="Opcional" style={{ cursor: "help", color: "#9AA5B1" }}>ⓘ</span></>}>
                      <input type="number" style={inputStyle} value={item.km || ""} onChange={(e) => update({ ...item, km: e.target.value })} placeholder="ex: 452300" />
                    </Field>
                  )}
                  {item.importante && (
                    <Field label={<>Empresa <span title="Preenche se o serviço foi feito numa empresa cadastrada (ex: Força Diesel). Deixe em branco se foi na estrada." style={{ cursor: "help", color: "#9AA5B1" }}>ⓘ</span></>}>
                      <select style={inputStyle} value={item.empresa || ""} onChange={(e) => update({ ...item, empresa: e.target.value, gerarBoleto: e.target.value ? item.gerarBoleto : false })}>
                        <option value="">Feito na estrada</option>
                        {boletosEmpresas.map((nome) => <option key={nome} value={nome}>{nome}</option>)}
                      </select>
                    </Field>
                  )}
                  {item.importante && item.empresa && (
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5A6472", gridColumn: "1 / -1" }}>
                      <input
                        type="checkbox"
                        checked={!!item.gerarBoleto}
                        onChange={(e) => update({ ...item, gerarBoleto: e.target.checked })}
                      />
                      Gerar boleto pendente pra {item.empresa} no valor desse gasto
                    </label>
                  )}
                  {item.importante && item.empresa && item.gerarBoleto && (
                    <Field label="Vencimento do boleto">
                      <input type="date" style={inputStyle} value={item.vencimentoBoleto || ""} onChange={(e) => update({ ...item, vencimentoBoleto: e.target.value })} onBlur={(e) => update({ ...item, vencimentoBoleto: corrigirAnoDigitado(e.target.value) })} />
                    </Field>
                  )}
                </>
              )}
            />
            </div>
            </div>
            </fieldset>

            <div style={{ background: "#fff", paddingTop: 12, position: "sticky", bottom: 0, zIndex: 5, marginLeft: -24, marginRight: -24, paddingLeft: 24, paddingRight: 24, paddingBottom: 16, boxShadow: "0 -6px 16px rgba(27,36,48,0.10)" }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              {tripTravada ? (
                <button
                  onClick={() => setTripTravada(false)}
                  style={{ flex: 1, background: "#D9A419", color: "#1B2430", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, cursor: "pointer" }}
                >
                  🔒 Editar viagem
                </button>
              ) : (
                <>
                  <button
                    onClick={saveTrip}
                    style={{ flex: 2.5, background: "#D9A419", color: "#1B2430", border: "none", borderRadius: 10, padding: "16px", fontWeight: 700, fontSize: 16, cursor: "pointer" }}
                  >
                    Salvar viagem
                  </button>
                  {trips.some((t) => t.id === editing.id) && (
                    <button
                      onClick={() => deleteTrip(editing.id)}
                      style={{ background: "#FBEBE8", color: "#B0402E", border: "1px solid #B0402E33", borderRadius: 10, padding: "12px 16px", fontWeight: 700, cursor: "pointer" }}
                    >
                      Excluir
                    </button>
                  )}
                </>
              )}
              </div>
              {(() => {
                const totalAbastecimento = (editing.abastecimentos || []).reduce((s, a) => s + (Number(a.valor) || 0), 0);
                const totalGastosExtras = (editing.gastosExtras || []).reduce((s, g) => s + (Number(g.valor) || 0), 0);
                return (
                  <div
                    style={{
                      background: "linear-gradient(160deg, #fff 0%, #EEF2FA 100%)",
                      border: "1px solid #C7D3F0",
                      borderRadius: 12,
                      padding: "10px 16px",
                      boxShadow: "0 -2px 8px rgba(27,36,48,0.06)",
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap",
                      justifyContent: "space-around",
                      textAlign: "center",
                      fontFamily: "'Inter', sans-serif",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 10, color: "#5A6472" }}>Total a receber</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1B2430" }}>{BRL(valorTotal(editing))}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#5A6472" }}>Comissão</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1B2430" }}>{BRL(comissao(editing))}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#5A6472" }}>Abastecimentos</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1B2430" }}>{(editing.abastecimentos || []).length} · {BRL(totalAbastecimento)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#5A6472" }}>Total de despesas</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#B0402E" }}>{BRL(totalAbastecimento + totalGastosExtras)}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}
      </div>
    </div>

    {/* bloco somente para impressao / PDF */}
    {reportOpen && reportView === "resumo" && (
      <div className="print-only" style={{ display: "none", padding: 24, fontFamily: "'Inter', sans-serif", color: "#1B2430" }}>
        <img src={LOGO_BASE64} alt="L.L. Campos Transportes" style={{ height: 44, marginBottom: 10, display: "block" }} />
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 4 }}>
          Relatório de líquido mensal
        </div>
        <div style={{ width: 56, height: 4, background: "#2563EB", borderRadius: 2, marginBottom: 10 }} />
        <div style={{ fontSize: 13, color: "#5A6472", marginBottom: 4 }}>
          Referência: {reportMonth} · {filterTruck === "all" ? "todos os caminhões" : truckLabel(filterTruck)} · gerado em {new Date().toLocaleDateString("pt-BR")}
        </div>
        <div style={{ fontSize: 11, color: "#5A6472", marginBottom: 16 }}>
          Líquido = receita das viagens − comissão − carregamento − abastecimento − gastos extras − despesas do veículo (data da viagem)
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#2563EB" }}>
              {["Cavalo/Carreta", "Viagens", "Receita", "Comissão", "Carregamento", "Abastec.", "Gastos", "Desp. Veíc.", "Líquido"].map((h) => (
                <th key={h} style={{ textAlign: "right", padding: "8px", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthlyReport.rows.map((r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? "#fff" : "#EEF2FA" }}>
                <td style={{ padding: "6px 8px", textAlign: "left", borderBottom: "1px solid #D7DBE0", fontWeight: 700 }}>
                  {r.placa}{r.carretaVinculada && <span style={{ color: "#5A6472", fontWeight: 400 }}> / {r.carretaVinculada}</span>}
                </td>
                <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0" }}>{r.viagens}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0", color: "#12503F" }}>{BRL(r.receita)}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0", color: "#B0402E" }}>−{BRL(r.comissaoTotal)}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0", color: "#B0402E" }}>−{BRL(r.carregamentoTotal)}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0", color: "#B0402E" }}>−{BRL(r.abastecimentoTotal)}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0", color: "#B0402E" }}>−{BRL(r.gastosTotal)}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0", color: "#B0402E" }}>−{BRL(r.despesasVeiculoTotal)}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: 700, borderBottom: "1px solid #D7DBE0" }}>{BRL(r.liquido)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "#1B2430" }}>
              <td style={{ padding: "8px", fontWeight: 700, color: "#fff" }}>TOTAL</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, color: "#fff" }}>{monthlyReport.totals.viagens}</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, color: "#fff" }}>{BRL(monthlyReport.totals.receita)}</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, color: "#fff" }}>−{BRL(monthlyReport.totals.comissaoTotal)}</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, color: "#fff" }}>−{BRL(monthlyReport.totals.carregamentoTotal)}</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, color: "#fff" }}>−{BRL(monthlyReport.totals.abastecimentoTotal)}</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, color: "#fff" }}>−{BRL(monthlyReport.totals.gastosTotal)}</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, color: "#fff" }}>−{BRL(monthlyReport.totals.despesasVeiculoTotal)}</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, color: "#fff" }}>{BRL(monthlyReport.totals.liquido)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    )}

    {reportOpen && reportView === "detalhado" && (
      <div className="print-only" style={{ display: "none", padding: 24, fontFamily: "'Inter', sans-serif", color: "#1B2430", fontSize: 11 }}>
        {detailedReport.map((g, i) => (
          <div key={g.id} style={{ marginBottom: 18, breakInside: "avoid", breakBefore: i === 0 ? "auto" : "page", pageBreakBefore: i === 0 ? "auto" : "always" }}>
            <img src={LOGO_BASE64} alt="L.L. Campos Transportes" style={{ height: 44, marginBottom: 10, display: "block" }} />
            <div style={{ background: "#2451A6", color: "#fff", padding: "8px 12px", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
              Viagens e Despesas
            </div>
            <div style={{ fontSize: 11, color: "#5A6472", marginBottom: 2 }}>
              Referência: {reportMonth} · {filterTruck === "all" ? "todos os caminhões" : truckLabel(filterTruck)}
            </div>
            <div style={{ fontSize: 10, color: "#5A6472", fontStyle: "italic", marginBottom: 12 }}>
              Relatório de viagens com lançamentos de despesa · gerado em {new Date().toLocaleDateString("pt-BR")}
            </div>
            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4 }}>Veículo: {g.placa}</div>
            {g.tripRows.map((t) => (
              <div key={t.id} style={{ marginBottom: 8 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "linear-gradient(180deg, #EEF2FA 0%, #2563EB 100%)", color: "#fff" }}>
                      <td style={{ padding: "4px 6px", fontWeight: 700, fontSize: 10, whiteSpace: "nowrap" }}>{fmtDate(t.data)}</td>
                      <td style={{ padding: "4px 6px", fontWeight: 700, fontSize: 10, whiteSpace: "nowrap" }}>{t.codigo}</td>
                      <td style={{ padding: "4px 6px", fontSize: 9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 90 }}>{t.empresa}</td>
                      <td style={{ padding: "4px 6px", fontSize: 9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 90 }}>{t.origem}</td>
                      <td style={{ padding: "4px 6px", textAlign: "right", fontSize: 9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 90 }}>{t.destino}</td>
                    </tr>
                  </thead>
                  <tbody>
                    {t.expenses.map((e, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #EEF0F2" }}>
                        <td style={{ padding: "3px 6px", width: 70 }}>{fmtDate(e.data)}</td>
                        <td style={{ padding: "3px 6px", width: 90 }}>{e.tipo}</td>
                        <td style={{ padding: "3px 6px" }}>{e.descricao}</td>
                        <td style={{ padding: "3px 6px", color: "#5A6472" }}>{e.planoDeConta}</td>
                        <td style={{ padding: "3px 6px", textAlign: "right", width: 80 }}>{BRL(e.valor)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3}></td>
                      <td style={{ padding: "3px 6px", textAlign: "right", fontWeight: 700 }}>Total de Despesas:</td>
                      <td style={{ padding: "3px 6px", textAlign: "right", fontWeight: 700 }}>{BRL(t.totalDespesas)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
            {g.despesasVeiculoTruck.length > 0 && (
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
                <thead>
                  <tr style={{ background: "#B0402E", color: "#fff" }}>
                    <td colSpan={5} style={{ padding: "4px 6px", fontWeight: 700 }}>Despesas do veículo</td>
                  </tr>
                </thead>
                <tbody>
                  {g.despesasVeiculoTruck.map((d) => (
                    <tr key={d.id} style={{ borderBottom: "1px solid #EEF0F2" }}>
                      <td style={{ padding: "3px 6px", width: 70 }}>{fmtDate(d.data)}</td>
                      <td colSpan={3} style={{ padding: "3px 6px" }}>{d.descricao} {d.observacao && `(${d.observacao})`}</td>
                      <td style={{ padding: "3px 6px", textAlign: "right", width: 80, color: "#B0402E" }}>−{BRL(Math.abs(Number(d.valor) || 0))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div style={{ textAlign: "right", fontWeight: 700, fontSize: 12, borderTop: "2px solid #1B2430", paddingTop: 4 }}>
              Total do Veículo: {BRL(g.totalVeiculo)}
            </div>
          </div>
        ))}
      </div>
    )}

    {relatorioRecebimentoOpen && (
      <div className="print-only" style={{ display: "none", padding: 24, fontFamily: "'Inter', sans-serif", color: "#1B2430", fontSize: 12 }}>
        <img src={LOGO_BASE64} alt="L.L. Campos Transportes" style={{ height: 44, marginBottom: 10, display: "block" }} />
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 4 }}>
          Relatório de Recebimento
        </div>
        <div style={{ width: 56, height: 4, background: "#2563EB", borderRadius: 2, marginBottom: 10 }} />
        <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 16 }}>
          Período: {fmtDate(recebimentoPeriodStart)} a {fmtDate(recebimentoPeriodEnd)}
          {" "}· {recebimentoCaminhaoFiltro === "all" ? "todos os caminhões" : truckLabel(recebimentoCaminhaoFiltro)}
          {" "}· gerado em {new Date().toLocaleDateString("pt-BR")}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#2563EB" }}>
              {["Data da viagem", "Data recebido", "Caminhão", "Contrato", "Empresa", "Tipo", "Valor"].map((h) => (
                <th key={h} style={{ textAlign: h === "Valor" ? "right" : "left", padding: "8px", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {relatorioRecebimento.items.map((r, i) => (
              <tr key={`${r.trip.id}-${r.tipo}`} style={{ background: i % 2 === 0 ? "#fff" : "#EEF2FA" }}>
                <td style={{ padding: "6px 8px", borderBottom: "1px solid #D7DBE0", color: "#5A6472" }}>{fmtDate(r.trip.data)}</td>
                <td style={{ padding: "6px 8px", borderBottom: "1px solid #D7DBE0" }}>{fmtDate(r.data)}</td>
                <td style={{ padding: "6px 8px", borderBottom: "1px solid #D7DBE0", fontWeight: 700 }}>{truckLabel(r.trip.caminhaoId)}</td>
                <td style={{ padding: "6px 8px", borderBottom: "1px solid #D7DBE0" }}>{r.trip.contrato || ""}</td>
                <td style={{ padding: "6px 8px", borderBottom: "1px solid #D7DBE0" }}>{r.trip.empresa || ""}</td>
                <td style={{ padding: "6px 8px", borderBottom: "1px solid #D7DBE0" }}>{r.tipo}</td>
                <td style={{ padding: "6px 8px", borderBottom: "1px solid #D7DBE0", textAlign: "right", fontWeight: 700, color: "#12503F" }}>{BRL(r.valor)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "#1B2430" }}>
              <td colSpan={6} style={{ padding: "8px", fontWeight: 700, color: "#fff" }}>TOTAL RECEBIDO</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, color: "#fff" }}>{BRL(relatorioRecebimento.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    )}

    {boletosReportOpen && (
      <div className="print-only" style={{ display: "none", padding: 24, fontFamily: "'Inter', sans-serif", color: "#1B2430", fontSize: 12 }}>
        <img src={LOGO_BASE64} alt="L.L. Campos Transportes" style={{ height: 44, marginBottom: 10, display: "block" }} />
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 4 }}>
          Relatório de Boletos
        </div>
        <div style={{ width: 56, height: 4, background: "#2563EB", borderRadius: 2, marginBottom: 10 }} />
        <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 16 }}>
          Período: {fmtDate(boletosPeriodStart)} a {fmtDate(boletosPeriodEnd)}
          {boletosEmpresasSelecionadas.length < boletosEmpresas.length && (
            <> · {boletosEmpresasSelecionadas.length} de {boletosEmpresas.length} empresas selecionadas</>
          )}
          {boletosReportStatus !== "all" && <> · Status: {boletosReportStatus === "aberto" ? "Em aberto" : boletosReportStatus === "vencido" ? "Vencido" : boletosReportStatus === "pago" ? "Pago" : "Pendente"}</>}
          {" "}· gerado em {new Date().toLocaleDateString("pt-BR")}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#1B2430" }}>
              {[
                { h: "Empresa", align: "left" },
                { h: "Descrição", align: "left" },
                { h: "Nota Fiscal", align: "left" },
                { h: "Vencimento", align: "center" },
                { h: "Conta", align: "left" },
                { h: "Pago em", align: "center" },
                { h: "Status", align: "center" },
                { h: "Valor", align: "right" },
              ].map((c) => (
                <th key={c.h} style={{ textAlign: c.align, padding: "8px", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 0.3 }}>{c.h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {boletosReport.items.map((b, i) => {
              const status = b.__kind === "pago" ? (b.__ehBaixaParcial ? "Pago (baixa)" : "Pago") : b.__status === "vencido" ? "Vencido" : "Pendente";
              const corStatus = b.__kind === "pago" ? "#12503F" : b.__status === "vencido" ? "#B0402E" : "#8A5A00";
              return (
                <tr key={b.__key} style={{ background: i % 2 === 0 ? "#fff" : "#F7F8F9" }}>
                  <td style={{ padding: "6px 8px", textAlign: "left", borderBottom: "1px solid #EEF0F2" }}>{b.empresa}</td>
                  <td style={{ padding: "6px 8px", textAlign: "left", borderBottom: "1px solid #EEF0F2" }}>{b.descricao}</td>
                  <td style={{ padding: "6px 8px", textAlign: "left", borderBottom: "1px solid #EEF0F2" }}>{b.notaFiscal}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center", borderBottom: "1px solid #EEF0F2" }}>{fmtDate(vencimentoEfetivo(b))}</td>
                  <td style={{ padding: "6px 8px", textAlign: "left", borderBottom: "1px solid #EEF0F2" }}>{b.__kind === "pago" ? (b.__contaEvento || b.contaBancaria) : b.contaBancaria}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center", borderBottom: "1px solid #EEF0F2" }}>{b.__kind === "pago" ? fmtDate(b.__dataItem) : "—"}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center", borderBottom: "1px solid #EEF0F2", color: corStatus, fontWeight: 700 }}>{status}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #EEF0F2", fontWeight: 700 }}>{BRL(b.__valorItem)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            {(boletosReportStatus === "all" || boletosReportStatus === "aberto" || boletosReportStatus === "pendente") && (
              <tr>
                <td colSpan={7} style={{ padding: "8px", textAlign: "right", fontWeight: 700, borderTop: "2px solid #1B2430" }}>Pendente:</td>
                <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, borderTop: "2px solid #1B2430", color: "#8A5A00" }}>{BRL(boletosReport.totals.pendente)}</td>
              </tr>
            )}
            {(boletosReportStatus === "all" || boletosReportStatus === "aberto" || boletosReportStatus === "vencido") && (
              <tr>
                <td colSpan={7} style={{ padding: "4px 8px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>Vencido:</td>
                <td style={{ padding: "4px 8px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>{BRL(boletosReport.totals.vencido)}</td>
              </tr>
            )}
            {(boletosReportStatus === "all" || boletosReportStatus === "pago") && (
              <tr>
                <td colSpan={7} style={{ padding: "4px 8px", textAlign: "right", fontWeight: 700, color: "#12503F" }}>Pago:</td>
                <td style={{ padding: "4px 8px", textAlign: "right", fontWeight: 700, color: "#12503F" }}>{BRL(boletosReport.totals.pago)}</td>
              </tr>
            )}
            <tr>
              <td colSpan={7} style={{ padding: "8px", textAlign: "right", fontWeight: 700, background: "#1B2430", color: "#fff" }}>TOTAL:</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, background: "#1B2430", color: "#fff" }}>
                {BRL(
                  boletosReportStatus === "all"
                    ? boletosReport.totals.total
                    : boletosReportStatus === "aberto"
                    ? boletosReport.totals.pendente + boletosReport.totals.vencido
                    : boletosReportStatus === "pendente"
                    ? boletosReport.totals.pendente
                    : boletosReportStatus === "vencido"
                    ? boletosReport.totals.vencido
                    : boletosReport.totals.pago
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    )}

    {view === "abastecimentos" && (
      <div className="print-only" style={{ display: "none", padding: 24, fontFamily: "'Inter', sans-serif", color: "#1B2430", fontSize: 12 }}>
        <img src={LOGO_BASE64} alt="L.L. Campos Transportes" style={{ height: 44, marginBottom: 10, display: "block" }} />
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 4 }}>
          Relatório de Abastecimentos
        </div>
        <div style={{ width: 56, height: 4, background: "#2563EB", borderRadius: 2, marginBottom: 10 }} />
        <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 16 }}>
          Período: {fmtDate(abastecPeriodStart)} a {fmtDate(abastecPeriodEnd)}
          {abastecPostoFilter !== "all" && <> · Posto: {abastecPostoFilter}</>}
          {abastecPlacaFilter !== "all" && <> · Placa: {truckLabel(abastecPlacaFilter)}</>}
          {" "}· gerado em {new Date().toLocaleDateString("pt-BR")}
        </div>
        {abastecReport.porPosto.map((grupo) => (
          <div key={grupo.posto} style={{ marginBottom: 16, breakInside: "avoid" }}>
            <div style={{ background: "#2563EB", color: "#fff", padding: "6px 10px", fontWeight: 700, fontSize: 13, marginBottom: 4, borderRadius: 6 }}>
              {grupo.posto} — {BRL(grupo.valor)} {(grupo.litragemDiesel > 0 || grupo.litragemArla > 0) && `(${grupo.litragemDiesel > 0 ? formatLitros(grupo.litragemDiesel) + "L diesel" : ""}${grupo.litragemDiesel > 0 && grupo.litragemArla > 0 ? " · " : ""}${grupo.litragemArla > 0 ? formatLitros(grupo.litragemArla) + "L arla" : ""})`}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#1B2430" }}>
                  {[
                    { h: "Data", align: "left" },
                    { h: "Caminhão", align: "left" },
                    { h: "Origem", align: "left" },
                    { h: "Litragem", align: "right" },
                    { h: "R$/L", align: "right" },
                    { h: "Cupom", align: "right" },
                    { h: "Valor", align: "right" },
                  ].map((c) => (
                    <th key={c.h} style={{ textAlign: c.align, padding: "6px 8px", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 12 }}>{c.h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grupo.items.map((a, i) => (
                  <tr key={a.id} style={{ background: i % 2 === 0 ? "#fff" : "#F7F8F9" }}>
                    <td style={{ padding: "4px 8px", textAlign: "left", borderBottom: "1px solid #EEF0F2" }}>{fmtDate(a.data)}</td>
                    <td style={{ padding: "4px 8px", textAlign: "left", borderBottom: "1px solid #EEF0F2" }}>{truckLabel(a.caminhaoId)}</td>
                    <td style={{ padding: "4px 8px", textAlign: "left", borderBottom: "1px solid #EEF0F2" }}>{a.origem}</td>
                    <td style={{ padding: "4px 8px", textAlign: "right", borderBottom: "1px solid #EEF0F2" }}>{a.litragem || ""}</td>
                    <td style={{ padding: "4px 8px", textAlign: "right", borderBottom: "1px solid #EEF0F2" }}>{Number(a.litragem) > 0 ? BRL(a.valor / Number(a.litragem)) : ""}</td>
                    <td style={{ padding: "4px 8px", textAlign: "right", borderBottom: "1px solid #EEF0F2" }}>{a.numeroCupom || ""}</td>
                    <td style={{ padding: "4px 8px", textAlign: "right", borderBottom: "1px solid #EEF0F2", fontWeight: 700 }}>{BRL(a.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14, background: "#1B2430", color: "#fff", padding: "10px 12px", borderRadius: 10 }}>
          <span>TOTAL GERAL</span>
          <span>{BRL(abastecReport.totals.valor)} {(abastecReport.totals.litragemDiesel > 0 || abastecReport.totals.litragemArla > 0) && `(${abastecReport.totals.litragemDiesel > 0 ? formatLitros(abastecReport.totals.litragemDiesel) + "L diesel" : ""}${abastecReport.totals.litragemDiesel > 0 && abastecReport.totals.litragemArla > 0 ? " · " : ""}${abastecReport.totals.litragemArla > 0 ? formatLitros(abastecReport.totals.litragemArla) + "L arla" : ""})`}</span>
        </div>
      </div>
    )}

    {view === "trocaoleo" && (
      <div className="print-only" style={{ display: "none", padding: 24, fontFamily: "'Inter', sans-serif", color: "#1B2430", fontSize: 12 }}>
        <img src={LOGO_BASE64} alt="L.L. Campos Transportes" style={{ height: 44, marginBottom: 10, display: "block" }} />
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 4 }}>
          Histórico de Trocas de Óleo
        </div>
        <div style={{ width: 56, height: 4, background: "#2563EB", borderRadius: 2, marginBottom: 10 }} />
        <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 16 }}>
          Período: {fmtDate(oleoPeriodStart)} a {fmtDate(oleoPeriodEnd)}
          {oleoPlacaFilter !== "all" && <> · Placa: {truckLabel(oleoPlacaFilter)}</>}
          {" "}· gerado em {new Date().toLocaleDateString("pt-BR")}
        </div>
        {(() => {
          const trocasPorCaminhao = {};
          trocaOleoReport.items.forEach((t) => { (trocasPorCaminhao[t.caminhaoId] = trocasPorCaminhao[t.caminhaoId] || []).push(t); });
          const servicosPorCaminhao = {};
          servicoVeiculoReport.items.forEach((s) => { (servicosPorCaminhao[s.caminhaoId] = servicosPorCaminhao[s.caminhaoId] || []).push(s); });
          const todosCaminhaoIds = Array.from(new Set([...Object.keys(trocasPorCaminhao), ...Object.keys(servicosPorCaminhao)]))
            .sort((a, b) => truckLabel(a).localeCompare(truckLabel(b)));
          return todosCaminhaoIds.map((caminhaoId) => {
            const itensTroca = trocasPorCaminhao[caminhaoId] || [];
            const itensServico = servicosPorCaminhao[caminhaoId] || [];
            return (
              <div key={caminhaoId} style={{ marginBottom: 20, breakInside: "avoid" }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
                  🚚 {truckLabel(caminhaoId)}
                </div>
                {itensTroca.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#5A6472", marginBottom: 4 }}>
                      Trocas de óleo ({itensTroca.length})
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                      <colgroup>
                        <col style={{ width: "16%" }} />
                        <col style={{ width: "16%" }} />
                        <col style={{ width: "16%" }} />
                        <col style={{ width: "52%" }} />
                      </colgroup>
                      <thead>
                        <tr style={{ background: "#1B2430" }}>
                          {["Data", "KM", "Filtro trocado", "Observação"].map((h) => (
                            <th key={h} style={{ textAlign: "left", padding: "7px 8px", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {itensTroca.map((t, i) => (
                          <tr key={t.id} style={{ background: i % 2 === 0 ? "#fff" : "#F7F8F9" }}>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{fmtDate(t.data)}</td>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{Number(t.km).toLocaleString("pt-BR")} km</td>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{t.filtroTrocado ? "Sim" : "Não"}</td>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", whiteSpace: "normal", wordBreak: "break-word" }}>{t.observacao || ""}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {itensServico.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#5A6472", marginBottom: 4 }}>
                      Outros serviços importantes ({itensServico.length})
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                      <colgroup>
                        <col style={{ width: "16%" }} />
                        <col style={{ width: "16%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "48%" }} />
                      </colgroup>
                      <thead>
                        <tr style={{ background: "#2E3A8C" }}>
                          {["Data", "KM", "Serviço", "Observação"].map((h) => (
                            <th key={h} style={{ textAlign: "left", padding: "7px 8px", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {itensServico.map((s, i) => (
                          <tr key={s.id} style={{ background: i % 2 === 0 ? "#fff" : "#EEF0FF" }}>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{fmtDate(s.data)}</td>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{s.km ? `${Number(s.km).toLocaleString("pt-BR")} km` : ""}</td>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{s.tipoServico}</td>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", whiteSpace: "normal", wordBreak: "break-word" }}>{s.observacao || ""}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          });
        })()}
      </div>
    )}

    {view === "semparar" && (
      <div className="print-only" style={{ display: "none", padding: 24, fontFamily: "'Inter', sans-serif", color: "#1B2430", fontSize: 12 }}>
        <img src={LOGO_BASE64} alt="L.L. Campos Transportes" style={{ height: 44, marginBottom: 10, display: "block" }} />
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 4 }}>
          Sem Parar
        </div>
        <div style={{ width: 56, height: 4, background: "#2563EB", borderRadius: 2, marginBottom: 10 }} />
        <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 16 }}>
          Período: {fmtDate(semPararPeriodStart)} a {fmtDate(semPararPeriodEnd)}
          {semPararPlacaFilter !== "all" && <> · Placa: {truckLabel(semPararPlacaFilter)}</>}
          {" "}· gerado em {new Date().toLocaleDateString("pt-BR")}
        </div>
        {semPararReport.porData.map((remessa) => (
          <div key={remessa.dataVencimento} style={{ marginBottom: 20, breakInside: "avoid" }}>
            <div style={{ background: remessa.temNaoConfirmado ? "#8A5A00" : "#12503F", color: "#fff", padding: "7px 10px", fontWeight: 700, fontSize: 14, marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
              <span>Vencimento {fmtDate(remessa.dataVencimento)} {remessa.temNaoConfirmado ? "· pendente de confirmar" : "· confirmado"}</span>
              <span>{BRL(remessa.totalRemessa)}</span>
            </div>
            {remessa.porPlaca.map((p) => (
              <div key={p.caminhaoId} style={{ marginBottom: 10 }}>
                <div style={{ background: "#2451A6", color: "#fff", padding: "5px 10px", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                  {truckLabel(p.caminhaoId)} — {BRL(p.total)}
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#EEF0FF" }}>
                      {[
                        { h: "Vencimento", align: "left" },
                        { h: "Pedágio", align: "right" },
                        { h: "Crédito", align: "right" },
                        { h: "Total", align: "right" },
                      ].map((c) => (
                        <th key={c.h} style={{ textAlign: c.align, padding: "6px 8px", color: "#2E3A8C", fontFamily: "'Inter', sans-serif", fontSize: 12 }}>{c.h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {p.items.map((s, i) => (
                      <tr key={s.id} style={{ background: i % 2 === 0 ? "#fff" : "#F7F8F9" }}>
                        <td style={{ padding: "4px 8px", textAlign: "left", borderBottom: "1px solid #EEF0F2" }}>{fmtDate(s.dataVencimento)}</td>
                        <td style={{ padding: "4px 8px", textAlign: "right", borderBottom: "1px solid #EEF0F2" }}>{BRL(Number(s.valorPedagio) || 0)}</td>
                        <td style={{ padding: "4px 8px", textAlign: "right", borderBottom: "1px solid #EEF0F2", color: "#B0402E" }}>−{BRL(Number(s.credito) || 0)}</td>
                        <td style={{ padding: "4px 8px", textAlign: "right", borderBottom: "1px solid #EEF0F2", fontWeight: 700 }}>{BRL(s.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
            {remessa.outros.length > 0 && (
              <div style={{ marginBottom: 6 }}>
                <div style={{ background: "#8A5A00", color: "#fff", padding: "5px 10px", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                  Outras arrecadações (não é por placa)
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {remessa.outros.map((o, i) => (
                      <tr key={o.id} style={{ background: i % 2 === 0 ? "#fff" : "#FFF6E2" }}>
                        <td style={{ padding: "4px 8px", textAlign: "left", borderBottom: "1px solid #EEF0F2" }}>{fmtDate(o.data)}</td>
                        <td style={{ padding: "4px 8px", textAlign: "left", borderBottom: "1px solid #EEF0F2" }}>{o.observacao || ""}</td>
                        <td style={{ padding: "4px 8px", textAlign: "right", borderBottom: "1px solid #EEF0F2", fontWeight: 700 }}>{BRL(Number(o.valor) || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14, background: "#1B2430", color: "#fff", padding: "10px 12px", borderRadius: 10 }}>
          <span>TOTAL GERAL (todas as remessas do período)</span>
          <span>{BRL(semPararReport.totals.total)}</span>
        </div>
      </div>
    )}

    {view === "seguro" && (
      <div className="print-only" style={{ display: "none", padding: 24, fontFamily: "'Inter', sans-serif", color: "#1B2430", fontSize: 12 }}>
        <img src={LOGO_BASE64} alt="L.L. Campos Transportes" style={{ height: 44, marginBottom: 10, display: "block" }} />
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 4 }}>
          Seguro
        </div>
        <div style={{ width: 56, height: 4, background: "#2563EB", borderRadius: 2, marginBottom: 10 }} />
        <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 16 }}>
          Mês: {seguroMesFiltro} · gerado em {new Date().toLocaleDateString("pt-BR")}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1B2430" }}>
              {["Cavalo", "Carreta", "Seguradora", "Total", "Observação"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "7px 8px", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {seguroReport.items.map((s, i) => {
              const total = (Number(s.cavaloValor) || 0) + (Number(s.carretaValor) || 0);
              return (
                <tr key={s.id} style={{ background: i % 2 === 0 ? "#fff" : "#F7F8F9" }}>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", fontWeight: 700 }}>{truckLabel(s.cavaloCaminhaoId)} ({BRL(Number(s.cavaloValor) || 0)})</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{s.carretaCaminhaoId ? `${truckLabel(s.carretaCaminhaoId)} (${BRL(Number(s.carretaValor) || 0)})` : ""}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", color: "#2E3A8C", fontWeight: 600 }}>
                    {!s.carretaCaminhaoId || s.seguradoraCavalo === s.seguradoraCarreta
                      ? (s.seguradoraCavalo || "")
                      : `cavalo: ${s.seguradoraCavalo || "—"} · carreta: ${s.seguradoraCarreta || "—"}`}
                  </td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", fontWeight: 700 }}>{BRL(total)}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{s.observacao || ""}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: "#EEF0F2" }}>
              <td colSpan={3} style={{ padding: "8px", fontWeight: 700 }}>TOTAL</td>
              <td style={{ padding: "8px", fontWeight: 700 }}>{BRL(seguroReport.total)}</td>
              <td></td>
            </tr>
            {Object.entries(seguroReport.porSeguradora).map(([nome, valor]) => (
              <tr key={nome}>
                <td colSpan={3} style={{ padding: "5px 8px", fontWeight: 700, color: "#2E3A8C", textAlign: "right" }}>TOTAL {nome}:</td>
                <td style={{ padding: "5px 8px", fontWeight: 700, color: "#2E3A8C" }}>{BRL(valor)}</td>
                <td></td>
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    )}

    {(statsDetailOpen === "receber" || statsDetailOpen === "recebido") && (
      <div className="print-only" style={{ display: "none", padding: 24, fontFamily: "'Inter', sans-serif", color: "#1B2430", fontSize: 12 }}>
        <img src={LOGO_BASE64} alt="L.L. Campos Transportes" style={{ height: 44, marginBottom: 10, display: "block" }} />
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 4 }}>
          {statsDetailOpen === "receber" ? "Viagens a receber" : "Viagens recebidas"}
        </div>
        <div style={{ width: 56, height: 4, background: "#2563EB", borderRadius: 2, marginBottom: 10 }} />
        <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 16 }}>
          gerado em {new Date().toLocaleDateString("pt-BR")}
        </div>
        {statsDetailOpen === "receber" ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#B0402E" }}>
                {["Data", "Caminhão", "Contrato", "Empresa", "Adiantamento pendente", "Saldo pendente", "Total pendente"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "7px 8px", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pendingList.map((r, i) => (
                <tr key={r.trip.id} style={{ background: i % 2 === 0 ? "#fff" : "#FBEBE8" }}>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{fmtDate(r.trip.data)}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", fontWeight: 700 }}>{truckLabel(r.trip.caminhaoId)}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{r.trip.contrato || ""}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{r.trip.empresa || ""}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{r.pendAdiantamento > 0 ? BRL(r.pendAdiantamento) : ""}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{r.pendSaldo > 0 ? BRL(r.pendSaldo) : ""}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", fontWeight: 700, color: "#B0402E" }}>
                    {r.semValorPreenchido ? "falta valor" : BRL(r.pendTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: "#1B2430" }}>
                <td colSpan={6} style={{ padding: "8px", fontWeight: 700, color: "#fff" }}>TOTAL</td>
                <td style={{ padding: "8px", fontWeight: 700, color: "#fff" }}>{BRL(pendingList.reduce((s, r) => s + r.pendTotal, 0))}</td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1F6F5C" }}>
                {["Data recebida", "Caminhão", "Contrato", "Empresa", "Tipo", "Valor"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "7px 8px", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {receivedList.map((r, i) => (
                <tr key={r.trip.id + r.tipo + i} style={{ background: i % 2 === 0 ? "#fff" : "#E9F5F1" }}>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{fmtDate(r.data)}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", fontWeight: 700 }}>{truckLabel(r.trip.caminhaoId)}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{r.trip.contrato || ""}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{r.trip.empresa || ""}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2" }}>{r.tipo}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #EEF0F2", fontWeight: 700, color: "#12503F" }}>{BRL(r.valor)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: "#1B2430" }}>
                <td colSpan={5} style={{ padding: "8px", fontWeight: 700, color: "#fff" }}>TOTAL</td>
                <td style={{ padding: "8px", fontWeight: 700, color: "#fff" }}>{BRL(receivedList.reduce((s, r) => s + r.valor, 0))}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    )}
    {statsDetailOpen === "comissao" && (
      <div className="print-only" style={{ display: "none", padding: 24, fontFamily: "'Inter', sans-serif", color: "#1B2430", fontSize: 12 }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 4 }}>
          Comissão por motorista
        </div>
        <div style={{ width: 56, height: 4, background: "#2563EB", borderRadius: 2, marginBottom: 10 }} />
        <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 16 }}>
          {commissionDriverFilter === "all" ? "Todos os motoristas" : commissionDriverFilter} · gerado em {new Date().toLocaleDateString("pt-BR")}
        </div>
        {commissionByDriver
          .filter((g) => commissionDriverFilter === "all" || g.motorista === commissionDriverFilter)
          .map((g, gi) => (
          <div key={g.motorista} style={{ marginBottom: 24, breakInside: "avoid", breakBefore: gi === 0 ? "auto" : "page", pageBreakBefore: gi === 0 ? "auto" : "always" }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{g.motorista}</div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 100px", background: "#FFF6E2", borderRadius: 8, padding: "6px 10px" }}>
                <div style={{ fontSize: 9, color: "#8A5A00", textTransform: "uppercase" }}>Gerado</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{BRL(g.total)}</div>
              </div>
              <div style={{ flex: "1 1 100px", background: "#FFF6E2", borderRadius: 8, padding: "6px 10px" }}>
                <div style={{ fontSize: 9, color: "#8A5A00", textTransform: "uppercase" }}>Reembolsos</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>+{BRL(g.totalReembolso)}</div>
              </div>
              <div style={{ flex: "1 1 100px", background: "#E9F5F1", borderRadius: 8, padding: "6px 10px" }}>
                <div style={{ fontSize: 9, color: "#12503F", textTransform: "uppercase" }}>Pago (vales)</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>−{BRL(g.totalPago)}</div>
              </div>
              <div style={{ flex: "1 1 100px", background: g.saldo > 0 ? "#FBEBE8" : "#E9F5F1", borderRadius: 8, padding: "6px 10px" }}>
                <div style={{ fontSize: 9, color: g.saldo > 0 ? "#7A2A1D" : "#12503F", textTransform: "uppercase" }}>Saldo devido</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: g.saldo > 0 ? "#B0402E" : "#12503F" }}>{BRL(g.saldo)}</div>
              </div>
            </div>

            <div style={{ fontSize: 10, color: "#5A6472", fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Viagens</div>
            {g.trips.length === 0 ? (
              <div style={{ fontSize: 11, color: "#9AA5B1", marginBottom: 10 }}>Nenhuma viagem nesse período.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
                <thead>
                  <tr style={{ background: "#D9A419" }}>
                    {["Caminhão", "Data", "Origem → Destino", "Empresa", "Comissão"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "5px 7px", color: "#fff", fontSize: 10 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {g.trips.map(({ trip, valor, semValorPreenchido }, i) => (
                    <tr key={trip.id} style={{ background: i % 2 === 0 ? "#fff" : "#FFF6E2" }}>
                      <td style={{ padding: "4px 7px", borderBottom: "1px solid #EEF0F2", fontWeight: 700, fontSize: 10 }}>{truckLabel(trip.caminhaoId)}</td>
                      <td style={{ padding: "4px 7px", borderBottom: "1px solid #EEF0F2", fontSize: 10 }}>{fmtDate(trip.data)}</td>
                      <td style={{ padding: "4px 7px", borderBottom: "1px solid #EEF0F2", fontSize: 10 }}>{trip.origem} → {trip.destino}</td>
                      <td style={{ padding: "4px 7px", borderBottom: "1px solid #EEF0F2", fontSize: 10 }}>{trip.empresa || ""}</td>
                      <td style={{ padding: "4px 7px", borderBottom: "1px solid #EEF0F2", fontWeight: 700, fontSize: 10, color: semValorPreenchido ? "#B0402E" : "#1B2430" }}>
                        {semValorPreenchido ? "falta valor" : BRL(valor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div style={{ fontSize: 10, color: "#5A6472", fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Vales e reembolsos</div>
            {g.vales.length === 0 ? (
              <div style={{ fontSize: 11, color: "#9AA5B1" }}>Nenhum lançamento registrado ainda.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#1F6F5C" }}>
                    {["Tipo", "Data", "Valor", "Observação"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "5px 7px", color: "#fff", fontSize: 10 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {g.vales.map((v, i) => {
                    const isReembolso = v.tipo === "reembolso";
                    return (
                      <tr key={v.id} style={{ background: i % 2 === 0 ? "#fff" : "#E9F5F1" }}>
                        <td style={{ padding: "4px 7px", borderBottom: "1px solid #EEF0F2", fontSize: 10, fontWeight: 700 }}>{isReembolso ? "Reembolso" : "Vale"}</td>
                        <td style={{ padding: "4px 7px", borderBottom: "1px solid #EEF0F2", fontSize: 10 }}>{fmtDate(v.data)}</td>
                        <td style={{ padding: "4px 7px", borderBottom: "1px solid #EEF0F2", fontSize: 10, fontWeight: 700 }}>{isReembolso ? "+" : "−"}{BRL(Number(v.valor) || 0)}</td>
                        <td style={{ padding: "4px 7px", borderBottom: "1px solid #EEF0F2", fontSize: 10 }}>{v.observacao || ""}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    )}
    </>
  );
}
