package com.MounimDev.Ecommercedev.service.interf;

import com.MounimDev.Ecommercedev.dto.AddressDto;
import com.MounimDev.Ecommercedev.dto.Response;

public interface AddressService {

	Response saveAndUpdateAddress(AddressDto addressDto);
}
